import { Entity } from './entity';

interface ILodgerProps {
  name: string;
  email: string;
  cpf: string;
  phoneNumber: string[];
  paymentInfos: string[];
}

export class Lodger extends Entity {
  name: string;
  email: string;
  cpf: string;
  phoneNumber: string[];
  paymentInfos: string[];

  constructor(props: ILodgerProps) {
    super();

    this.name = props.name;
    this.email = props.email;
    this.cpf = props.cpf;
    this.phoneNumber = props.phoneNumber;
    this.paymentInfos = props.paymentInfos;
  }
}
