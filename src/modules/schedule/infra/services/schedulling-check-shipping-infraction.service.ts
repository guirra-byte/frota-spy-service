import { inject, injectable } from 'tsyringe';
import { IDateProvider } from '../../../../shared/infra/providers/date-provider/interfaces/Idate-provider.interface';
import { ScheduleRental } from '../../domain/entities/schedule-rental.entity';
import { ScheduleRentalStatus } from '../../domain/enums/schedule-rental-status.enum';
import { IQueueManagerProvider } from '../../../../shared/infra/providers/queue-manager-provider/interfaces/Iqueue-manager-provider.interface';
import { JobType, Queue } from 'bullmq';
import { ShippingCar } from '../../../shipping_car/domain/entities/shipping.entity';
import { QueueEvents } from 'bullmq';

interface IDividAndConquer {
  groups: number;
  elementsInGroup: number;
}

@injectable()
export class SchedullingCheckShippingInfractionService {
  private shippingCars: ShippingCar[] = [];
  private schedule: ScheduleRental[] = [];
  private ctxQueues: Record<string, { queue: Queue; events: QueueEvents }> = {};

  constructor(
    @inject('QueueManagerProvider')
    private queueManagerProvider: IQueueManagerProvider,

    @inject('DateProvider') private dateProvider: IDateProvider,
  ) {
    async () => {
      this.ctxQueues = {
        ['over_launch_limit']: {
          queue: await this.queueManagerProvider.queue('over_launch_limit'),
          events: new QueueEvents('over_launch_limit'),
        },

        ['check_infractions_launch']: {
          queue: await this.queueManagerProvider.queue(
            'check_infractions_launch',
          ),
          events: new QueueEvents('check_infractions_launch'),
        },
      };
    };
  }

  async execute() {
    const count: Record<string, IDividAndConquer> = {
      ['over']: { groups: 0, elementsInGroup: 0 },
      ['check']: { groups: 0, elementsInGroup: 0 },
    };

    async function infractionsLaunchDeadline(
      _THIS: SchedullingCheckShippingInfractionService,
      rentals: ScheduleRental[],
    ) {
      async function clusterInfractions(
        _INSTANCE: SchedullingCheckShippingInfractionService,
        remaining: ScheduleRental[],
        current: Record<string, ScheduleRental[]> = {},
        overDeadline: Record<string, ScheduleRental[]> = {},
        shippingCars: ShippingCar[] = [],
      ) {
        for (let index = 0; index < remaining.length; index++) {
          const item = remaining[index];

          if (item.status !== ScheduleRentalStatus['CANCELLED']) {
            const now = new Date();
            const limitInfractionLaunchDate =
              await _INSTANCE.dateProvider.addDays(
                now,
                Number(process.env.LIMIT_LAUNCH),
              );

            const withInLimitInfractionLaunch = await Promise.all([
              await _INSTANCE.dateProvider.isBefore(
                now,
                limitInfractionLaunchDate,
              ),
              await _INSTANCE.dateProvider.sameDay(
                now,
                limitInfractionLaunchDate,
              ),
            ]);

            const claimShippingCar = _THIS.shippingCars.find(
              (car) => car.plate === item.rover.plate,
            );

            //Se ainda for no mesmo dia da Deadline uma última verificação deve ser feita
            //Linha 93
            if (claimShippingCar) {
              const key =
                withInLimitInfractionLaunch[0] || withInLimitInfractionLaunch[1]
                  ? 'check'
                  : 'over';

              if (count[key]) {
                if (count[key].elementsInGroup === remaining.length / 2) {
                  count[key].groups += 1;
                  count[key].elementsInGroup = 0;
                }
              } else {
                count[key] = { groups: 1, elementsInGroup: 1 };

                if (key === 'check') {
                  current[`group-${count[key].groups}`].push(item);
                } else {
                  overDeadline[`group-${count[key].groups}`].push(item);
                }
              }

              count[key].elementsInGroup += 1;

              shippingCars.push(claimShippingCar);
              remaining = remaining
                .slice(0, index)
                .concat(remaining.slice(index + 1));

              clusterInfractions(_INSTANCE, remaining, current, overDeadline);
            }
          }
        }

        return [current, overDeadline];
      }

      const delayedJobs = async (_queue: Queue, type: JobType) => {
        const jobsCount = await _queue.getJobCounts(type);
        return jobsCount['waiting'] * 1500;
      };

      const [toLaunch, overLaunch] = await clusterInfractions(_THIS, rentals);
      for (const key in _THIS.ctxQueues) {
        const target = key === 'over_launch_limit' ? overLaunch : toLaunch;

        for (const groups in target) {
          const delayConfig = await delayedJobs(
            _THIS.ctxQueues[key].queue,
            'waiting',
          );

          //Escutar a emissão do evento 'completed' para reagendar as verificações que não possuem resultado (Infração ou Fora do período);

          await _THIS.ctxQueues[key].queue.addBulk([
            {
              name: key,
              data: groups,
              opts: {
                delay: delayConfig,
              },
            },
          ]);
        }
      }
    }

    await infractionsLaunchDeadline(this, this.schedule);
  }
}
