import { ICreateShippingRoverDTO } from '../../../domain/dtos/Icreate-shipping-rover.dto';
import { ShippingCar } from '../../../domain/entities/shipping.entity';
import { IShippingCarData } from '../abstract/Ishipping-car.data';

export class ShippingCarDatasource implements IShippingCarData {
  save(data: ICreateShippingRoverDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findCarByPlate(plate: string): Promise<ShippingCar> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<ShippingCar[]> {
    throw new Error('Method not implemented.');
  }
}
