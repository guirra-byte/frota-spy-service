import { Job } from 'bullmq';

export interface IWorkerData {
  name: string;
  processor: (job: Job) => Promise<any>;
  options?: WorkerOptions | undefined;
}
