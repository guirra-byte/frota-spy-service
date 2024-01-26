import { Job, Queue } from 'bullmq';
import { IQueueManagerProvider } from '../../../../shared/infra/providers/queue-manager-provider/interfaces/Iqueue-manager-provider.interface';
import { IScheduleRentalDTO } from '../../domain/dtos/Ischedule-rental.dto';
import { inject, injectable } from 'tsyringe';
import { EventEmitter } from 'stream';

@injectable()
export class ScheduleRentalService {
  private ctxQueues: Record<string, Queue> = {};

  constructor(
    @inject('QueueManagerProvider')
    private queueManagerProvider: IQueueManagerProvider,

    @inject('NodeEvents') private nodeEvents: EventEmitter,
  ) {
    async () => {
      const queues = ['schedule_rental', 'failed_rental'];
      for (const queue of queues) {
        if (!this.ctxQueues[queue]) {
          this.ctxQueues[queue] = await this.queueManagerProvider.queue(queue, {
            defaultJobOptions: {
              attempts: Number(process.env.QUEUE_JOBS_ATTEMPTS),
              lifo: true,
              removeOnFail: true,
              removeOnComplete: true,
            },
          });
        }
      }
    };
  }

  async execute(data: IScheduleRentalDTO) {
    this.ctxQueues['schedule_rental'].on(
      'removed',
      async (job: Job<any, any, string>) => {
        const fail = await job.isFailed();

        if (fail && job.queueName === 'schedule_rental') {
          if (job.opts.attempts && job.attemptsMade >= job.opts.attempts) {
            this.queueManagerProvider.addJobs(
              this.ctxQueues['schedule_rental'],
              'fail_letter',
              job.data,
            );
          }
        }

        this.nodeEvents.emit('try_schedule', { data: job.data });
      },
    );

    //Disparar evento para listener endpoint que estar ouvindo os eventos do servidor;
    await this.queueManagerProvider.addJobs(
      this.ctxQueues['schedule_rental'],
      'rental',
      data,
    );
  }
}
