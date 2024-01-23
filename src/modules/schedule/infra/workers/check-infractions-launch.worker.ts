import { Job, Worker } from 'bullmq';
import { IVehicleInfractionProvider } from '../../../../shared/infra/providers/vehicle-infraction-provider/interfaces/Ivehicle-infraction-provider.interface';
import { inject } from 'tsyringe';
import { ScheduleRental } from '../../domain/entities/schedule-rental.entity';
import { ILodgerNode } from '../../../shipping_car/domain/entities/shipping.entity';
import { IDateProvider } from '../../../../shared/infra/providers/date-provider/interfaces/Idate-provider.interface';
import { IQueueManagerProvider } from '../../../../shared/infra/providers/queue-manager-provider/interfaces/Iqueue-manager-provider.interface';
import { Infraction } from '../../../../shared/domain/entities/infraction.entity';
import { IWorkerData } from '../../../../shared/domain/interfaces/Iworker.interface';
import { IShippingCarData } from '../../../shipping_car/infra/db/abstract/Ishipping-car.data';
import { IScheduleData } from '../db/abstract/Ischedule.data';

export interface IDriveInfractionOwnership {
  plate: string;
  ownerId: string;
  moment: string;
}

export class CheckInfractionsLaunchWorker extends Worker {
  constructor(
    @inject('ShippingDatasource')
    private shippingCarDatasource: IShippingCarData,
    @inject('VehicleInfractionProvider')
    private vehicleInfractionProvider: IVehicleInfractionProvider,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('QueueManagerProvider')
    private queueManagerProvider: IQueueManagerProvider,
    @inject('ScheduleDatasource') private scheduleDatasource: IScheduleData,

    props: IWorkerData,
  ) {
    super(
      props.name,
      async (jobs: Job<ScheduleRental[]>) => {
        switch (jobs.queueName) {
          case 'check_infractions_launch':
            const callIn: Infraction[] =
              await this.vehicleInfractionProvider.callIn();

            const outInfractionLaunchDeadline: ScheduleRental[] = [];
            const toLaterCheck = [];
            const infractionsOwnerships: IDriveInfractionOwnership[] = [];

            for (let position = 0; position < callIn.length; position++) {
              const infraction = callIn[position];
              const claimRental = jobs.data.findIndex(
                (rental) => rental.rover.plate === infraction.roverPlate,
              );

              //Se ainda estiver dentro do prazo de lançamento de infração deve ser possível reagendar;
              //Caso contrário deve ser possível remover do fluxo de verificação;
              if (claimRental === -1) {
                toLaterCheck.push(jobs.data[claimRental]);

                jobs.data = jobs.data
                  .slice(0, claimRental)
                  .concat(jobs.data.slice(claimRental + 1));

                continue;
              }

              const claimShippingCar =
                await this.shippingCarDatasource.findCarByPlate(
                  callIn[position].roverPlate,
                );

              if (
                claimShippingCar &&
                claimShippingCar.plate !== infraction.roverPlate
              ) {
                continue;
              }

              const inLaunchDeadline = async (
                carLodgersHistory: ILodgerNode | null,
              ) => {
                if (carLodgersHistory) {
                  if (carLodgersHistory.lodger) {
                    const claimLodgerShippingTenureTime = jobs.data.find(
                      (schedule) =>
                        schedule.lodger === carLodgersHistory.lodger,
                    );

                    if (!claimLodgerShippingTenureTime) {
                      if (carLodgersHistory.next) {
                        inLaunchDeadline(carLodgersHistory.next);
                      }
                    } else {
                      const substractLaunchTime =
                        await this.dateProvider.removeDays(
                          new Date(infraction.moment),
                          Number(process.env.LAUNCH_TIME),
                        );

                      const inInfractionTimeInterval = await Promise.all([
                        await this.dateProvider.isBefore(
                          claimLodgerShippingTenureTime.finishAt,
                          new Date(infraction.moment),
                        ),
                        await this.dateProvider.isAfter(
                          claimLodgerShippingTenureTime.startAt,
                          substractLaunchTime,
                        ),
                      ]);

                      //Se o período de locação começar antes do período de lançamento de infração,
                      //pode significar que a infração pertence ao inquilino anterior ou houve algum erro;
                      //Verificação deve ser feita no bloco de código a partir da linha 118;

                      if (inInfractionTimeInterval.every((check) => check)) {
                        infractionsOwnerships.push({
                          plate: infraction.roverPlate,
                          ownerId: carLodgersHistory.lodger._id,
                          moment: infraction.moment,
                        });
                      } else {
                        outInfractionLaunchDeadline.push(
                          claimLodgerShippingTenureTime,
                        );
                      }
                    }
                  }
                }
              };

              if (claimShippingCar) {
                if (claimShippingCar.lodgers) {
                  await inLaunchDeadline(claimShippingCar.lodgers);
                }
              }
            }

            //Disparo de evento para o próximo item na fila de processamento;

            this.on('completed', async (job, result: ScheduleRental[]) => {
              if (result.length > 0) {
                const toLaterCheckIds = result.map((schedule) => {
                  return schedule._id;
                });

                if (process.env.CRON_EXPRESSION) {
                  const claimNxtCheckDate = await this.dateProvider.checkDays(
                    new Date(),
                    process.env.CRON_EXPRESSION,
                  );

                  if (claimNxtCheckDate) {
                    this.scheduleDatasource.updateCheckLaterDate(
                      toLaterCheckIds,
                      claimNxtCheckDate,
                    );
                  }
                }
              }
            });

            this.emit(
              'completed',
              jobs,
              {
                reSchedule: toLaterCheck,
              },
              '',
            );

            const ownerQueue =
              await this.queueManagerProvider.queue('drive_violators');
            await ownerQueue.addBulk([
              {
                name: 'drive_infraction_owner',
                data: infractionsOwnerships,
              },
            ]);

            const markOffQueue =
              await this.queueManagerProvider.queue('mark_off');
            markOffQueue.addBulk([
              {
                name: 'mark_off_launch_deadline',
                data: outInfractionLaunchDeadline,
              },
            ]);
        }
      },
      { ...props.options, autorun: true },
    );
  }
}
