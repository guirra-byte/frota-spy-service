import { Queue } from 'bullmq';

export interface IQueueManagerProvider {
  queue(name: string): Promise<Queue>;
  addJobs(ownerQueue: Queue, job: string, data: any): Promise<void>;
}
