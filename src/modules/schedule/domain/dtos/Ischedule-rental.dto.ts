import { Lodger } from '../../../../shared/domain/entities/lodger.entity';
import { ShippingCar } from '../../../shipping_car/domain/entities/shipping.entity';

export interface IScheduleRentalDTO {
  lodger: Lodger;
  terms: string;
  cost: number;
  rover: ShippingCar;
  startAt: Date;
  finishAt: Date;
}
