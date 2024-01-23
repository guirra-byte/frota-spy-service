import { Queue } from 'bullmq';
import { IQueueManagerProvider } from '../interfaces/Iqueue-manager-provider.interface';

export class QueueManagerProvider implements IQueueManagerProvider {
  constructor() {}

  async queue(name: string): Promise<Queue> {
    const newQueue = new Queue(name);
    return newQueue;
  }

  async addJobs(ownerQueue: Queue, job: string, data: any): Promise<void> {
    await ownerQueue.add(job, data);
  }
}
