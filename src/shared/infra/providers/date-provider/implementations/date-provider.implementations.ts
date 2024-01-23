import {
  addDays,
  subDays,
  isAfter,
  isBefore,
  isSameDay,
  differenceInDays,
  getDay,
  nextDay,
} from 'date-fns';
import { IDateProvider } from '../interfaces/Idate-provider.interface';

export class DateProvider implements IDateProvider {
  async compareDays(date: Date, dateToCompare: Date): Promise<number> {
    return differenceInDays(date, dateToCompare);
  }

  async sameDay(date: Date, dateToCompare: Date): Promise<boolean> {
    return isSameDay(date, dateToCompare);
  }

  async addDays(date: Date, days: number): Promise<Date> {
    return addDays(date, days);
  }

  async removeDays(date: Date, days: number): Promise<Date> {
    return subDays(date, days);
  }

  async isAfter(date: Date, dateToCompare: Date): Promise<boolean> {
    return isAfter(date, dateToCompare);
  }

  async isBefore(date: Date, dateToCompare: Date): Promise<boolean> {
    return isBefore(date, dateToCompare);
  }

  async checkDays(
    date: Date,
    cronExpression: string,
  ): Promise<Date | undefined> {
    const cron = cronExpression.match(/(\d+,\d+)$/);

    if (cron) {
      const [execOn, execAnd] = cron[1].split(',').map((cronOperator) => {
        return Number(cronOperator);
      });

      const day = getDay(date) < execAnd ? getDay(execOn) : getDay(execAnd);
      const claimNextDay = nextDay(date, day);

      return claimNextDay;
    }
  }
}
