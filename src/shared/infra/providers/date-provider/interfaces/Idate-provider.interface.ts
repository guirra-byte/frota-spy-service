export interface IDateProvider {
  isBefore(date: Date, dateToCompare: Date): Promise<boolean>;
  isAfter(date: Date, dateToCompare: Date): Promise<boolean>;
  compareDays(date: Date, dateToCompare: Date): Promise<number>;
  sameDay(date: Date, dateToCompare: Date): Promise<boolean>;
  addDays(date: Date, days: number): Promise<Date>;
  removeDays(date: Date, days: number): Promise<Date>;

  checkDays(date: Date, cronExpression: string): Promise<Date | undefined>;
}
