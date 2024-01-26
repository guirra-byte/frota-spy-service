import { Queue, QueueOptions } from 'bullmq';
import { IQueueManagerProvider } from '../interfaces/Iqueue-manager-provider.interface';

export class QueueManagerProvider implements IQueueManagerProvider {
  constructor() {}

  async queue(name: string, options: QueueOptions | undefined): Promise<Queue> {
    const newQueue = new Queue(name, options);
    return newQueue;
  }

  async addJobs(ownerQueue: Queue, job: string, data: any): Promise<void> {
    await ownerQueue.add(job, data);
  }
}
