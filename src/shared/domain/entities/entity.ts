import { randomUUID } from 'crypto';

export class Entity {
  private id: string;
  private createdAt: Date;

  constructor(id?: string) {
    this.id = id ?? randomUUID();
    this.createdAt = new Date();
  }

  get _id(): string {
    return this.id;
  }

  get _createdAt(): Date {
    return this.createdAt;
  }
}
