import { Queue, QueueOptions } from 'bullmq';

export interface IQueueManagerProvider {
  queue(name: string, options: QueueOptions | undefined): Promise<Queue>;
  addJobs(ownerQueue: Queue, job: string, data: any): Promise<void>;
}
