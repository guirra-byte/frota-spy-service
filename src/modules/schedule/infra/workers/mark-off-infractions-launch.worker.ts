import { Job, Worker } from 'bullmq';
import { IWorkerData } from '../../../../shared/domain/interfaces/Iworker.interface';
import { ScheduleRental } from '../../domain/entities/schedule-rental.entity';
import { IScheduleData } from '../db/abstract/Ischedule.data';
import { inject } from 'tsyringe';

export class MarkOffInfractionsLaunchWorker extends Worker {
  constructor(
    @inject('ScheduleDatasource') private scheduleDatasource: IScheduleData,
    props: IWorkerData,
  ) {
    super(
      props.name,
      async (jobs: Job<ScheduleRental[]>): Promise<void> => {
        switch (jobs.name) {
          case 'mark_off_launch_deadline':
            const ids = jobs.data.map((scheduleRental) => scheduleRental._id);
            this.scheduleDatasource.updateOutInfractionLaunch(ids, true);
        }

        return;
      },
      {
        ...props,
        autorun: true,
      },
    );
  }
}
