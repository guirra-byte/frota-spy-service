import { Entity } from '../../../../shared/domain/entities/entity';
import { Lodger } from '../../../../shared/domain/entities/lodger.entity';
import { ShippingCar } from '../../../shipping_car/domain/entities/shipping.entity';
import { ScheduleRentalStatus } from '../enums/schedule-rental-status.enum';

interface IScheduleRentalProps {
  lodger: Lodger;
  terms: string;
  cost: number;
  rover: ShippingCar;
  startAt: Date;
  finishAt: Date;
}

export class ScheduleRental extends Entity {
  lodger: Lodger;
  terms: string;
  rover: ShippingCar;
  cost: number;
  startAt: Date;
  finishAt: Date;
  status: ScheduleRentalStatus;
  outInfractionLaunchDeadline: boolean;

  constructor(props: IScheduleRentalProps) {
    super();

    this.lodger = props.lodger;
    this.terms = props.terms;
    this.cost = props.cost;
    (this.startAt = props.startAt), (this.finishAt = props.finishAt);
    this.status = ScheduleRentalStatus['STARTED'];
    this.rover = props.rover;
    this.outInfractionLaunchDeadline = false;
  }
}
