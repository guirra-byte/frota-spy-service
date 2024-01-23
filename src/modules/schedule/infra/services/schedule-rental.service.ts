import { Queue } from 'bullmq';
import { IQueueManagerProvider } from '../../../../shared/infra/providers/queue-manager-provider/interfaces/Iqueue-manager-provider.interface';
import { IScheduleRentalDTO } from '../../domain/dtos/Ischedule-rental.dto';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ScheduleRentalService {
  private scheduleRentalQueue: Queue;

  constructor(
    @inject('QueueManagerProvider')
    private queueManagerProvider: IQueueManagerProvider,
  ) {
    async () => {
      this.scheduleRentalQueue =
        await this.queueManagerProvider.queue('schedule_rental');
    };
  }

  async execute(data: IScheduleRentalDTO) {
    this.queueManagerProvider.addJobs(this.scheduleRentalQueue, 'rental', data);
  }
}
