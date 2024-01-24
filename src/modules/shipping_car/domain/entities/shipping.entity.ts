import { Entity } from '../../../../shared/domain/entities/entity';
import { Infraction } from '../../../../shared/domain/entities/infraction.entity';
import { Lodger } from '../../../../shared/domain/entities/lodger.entity';
import { Tag } from '../../../../shared/domain/entities/tag.entity';
import { ScheduleRental } from '../../../schedule/domain/entities/schedule-rental.entity';
import { HireStatus } from '../enums/shipping-rover-status.enum';

interface IShippingRoverProps {
  name: string;
  plate: string;
  description: string;
}

export class ShippingCar extends Entity {
  name: string;
  plate: string;
  description: string;
  tags: Tag[] = [];
  lodgers?: Lodger[];
  infractions: Infraction[][] = [];
  hireSchedule: ScheduleRental[][] = [];
  status: HireStatus = HireStatus['UNAVAILABLE'];
  inOperationSince: Date;

  constructor(props: IShippingRoverProps) {
    super();

    this.name = props.name;
    this.plate = props.plate;
    this.description = props.description;
    this.inOperationSince = new Date();
  }
}
