import { Entity } from './entity';

interface IInfractionProps {
  lawInfractionCode: string;
  infractionStatus: string;
  infractionNotice: string;
  roverPlate: string;
  moment: string;
  description: string;
  localization: string;
  type: string;
  cost: string;
  sender: string;
}

export class Infraction extends Entity {
  lawInfractionCode: string;
  infractionStatus: string;
  infractionNotice: string;
  roverPlate: string;
  moment: string;
  description: string;
  localization: string;
  type: string;
  cost: string;
  sender: string;

  constructor(props: IInfractionProps) {
    super();

    this.lawInfractionCode = props.lawInfractionCode;
    this.infractionStatus = props.infractionStatus;
    this.infractionNotice = props.infractionNotice;
    this.roverPlate = props.roverPlate;
    this.moment = props.moment;
    this.description = props.description;
    this.localization = props.localization;
    this.type = props.type;
    this.cost = props.cost;
    this.sender = props.sender;
  }
}
