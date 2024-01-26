import { ICreateShippingRoverDTO } from '../../../domain/dtos/Icreate-shipping-rover.dto';
import { ShippingCar } from '../../../domain/entities/shipping.entity';

export interface IShippingCarData {
  save(input: ICreateShippingRoverDTO): Promise<void>;
  findCarByPlate(plate: string): Promise<ShippingCar | null>;
  findAll(): Promise<ShippingCar[]>;
}
