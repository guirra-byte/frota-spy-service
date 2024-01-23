import { injectable } from 'tsyringe';
import { IScheduleData } from '../abstract/Ischedule.data';
import { ScheduleRental } from '../../../domain/entities/schedule-rental.entity';
import { ScheduleRentalStatus } from '../../../domain/enums/schedule-rental-status.enum';

@injectable()
export class ScheduleDatasource implements IScheduleData {
  save(input: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findUsageScheduleByPlate(plate: string): Promise<ScheduleRental> {
    throw new Error('Method not implemented.');
  }

  updateRentalStatus(
    rentalId: string,
    status: ScheduleRentalStatus,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  updateOutInfractionLaunch(ids: string[], status: boolean): Promise<void> {
    throw new Error('Method not implemented.');
  }

  updateCheckLaterDate(ids: string[], date: Date): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
