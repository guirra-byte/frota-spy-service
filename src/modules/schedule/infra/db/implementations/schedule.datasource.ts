import { injectable } from 'tsyringe';
import { IScheduleData } from '../abstract/Ischedule.data';
import { ScheduleRentalStatus } from '../../../domain/enums/schedule-rental-status.enum';
import { PrismaClient, ScheduleRental } from '@prisma/client';
import { PrismaProvider } from '../../../../../shared/infra/providers/prisma/prisma-provider';

@injectable()
export class ScheduleDatasource implements IScheduleData {
  private prismaProvider: PrismaClient;

  constructor() {
    this.prismaProvider = PrismaProvider;
  }

  async save(input: any): Promise<void> {
    await this.prismaProvider.scheduleRental.create({ data: input });
  }

  async findUsageScheduleByPlate(
    plate: string,
  ): Promise<ScheduleRental | null> {
    const schedule = await this.prismaProvider.scheduleRental.findFirst({
      where: { roverPlate: plate },
      include: {
        lodger: true,
      },
    });

    return schedule;
  }

  async updateRentalStatus(
    rentalId: string,
    status: ScheduleRentalStatus,
  ): Promise<void> {
    await this.prismaProvider.scheduleRental.update({
      where: { id: rentalId },
      data: { status },
    });
  }

  async updateOutInfractionLaunch(
    ids: string[],
    status: boolean,
  ): Promise<void> {
    await this.prismaProvider.scheduleRental.updateMany({
      where: { id: { in: ids } },
      data: { status: { set: `${status}` } },
    });
  }

  async updateCheckLaterDate(ids: string[], date: Date): Promise<void> {
    await this.prismaProvider.scheduleRental.updateMany({
      where: { id: { in: ids } },
      data: { nextCheck: date },
    });
  }
}
