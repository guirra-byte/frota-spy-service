import { Entity } from './entity';

export class Tag extends Entity {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
