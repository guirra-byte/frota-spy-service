import { ICreateShippingRoverDTO } from '../../../domain/dtos/Icreate-shipping-rover.dto';
import { IShippingCarData } from '../abstract/Ishipping-car.data';
import { PrismaProvider } from '../../../../../shared/infra/providers/prisma/prisma-provider';
import { PrismaClient, ShippingCar } from '@prisma/client';
import { HireStatus } from '../../../domain/enums/shipping-rover-status.enum';

export class ShippingCarDatasource implements IShippingCarData {
  private prismaProvider: PrismaClient;

  constructor() {
    this.prismaProvider = PrismaProvider;
  }

  async save(data: ICreateShippingRoverDTO): Promise<void> {
    await this.prismaProvider.shippingCar.create({
      data: {
        ...data,
        status: HireStatus['UNAVAILABLE'],
        inOperationSince: `${new Date()}`,
      },
    });
  }

  async findCarByPlate(plate: string): Promise<ShippingCar | null> {
    const car = await this.prismaProvider.shippingCar.findUnique({
      where: { plate },
      include: {
        lodgers: true,
      },
    });

    return car;
  }

  async findAll(): Promise<ShippingCar[]> {
    const cars = await this.prismaProvider.shippingCar.findMany({
      include: {
        lodgers: true,
        infractions: { include: { rover: true } },
        hireSchedule: { include: { ShippingCar: true, lodger: true } },
      },
    });

    return cars;
  }
}
