import { ScheduleRental } from '@prisma/client';
import { ScheduleRentalStatus } from '../../../domain/enums/schedule-rental-status.enum';

export interface IScheduleData {
  save(input: any): Promise<void>;
  findUsageScheduleByPlate(plate: string): Promise<ScheduleRental | null>;
  updateRentalStatus(
    rentalId: string,
    status: ScheduleRentalStatus,
  ): Promise<void>;
  updateOutInfractionLaunch(ids: string[], status: boolean): Promise<void>;
  updateCheckLaterDate(ids: string[], date: Date): Promise<void>;
}
