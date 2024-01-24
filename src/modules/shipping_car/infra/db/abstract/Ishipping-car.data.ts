import { ShippingCar } from '@prisma/client';
import { ICreateShippingRoverDTO } from '../../../domain/dtos/Icreate-shipping-rover.dto';

export interface IShippingCarData {
  save(input: ICreateShippingRoverDTO): Promise<void>;
  findCarByPlate(plate: string): Promise<ShippingCar | null>;
  findAll(): Promise<ShippingCar[]>;
}
