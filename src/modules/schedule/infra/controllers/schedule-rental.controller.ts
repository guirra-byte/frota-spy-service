import { Response, Request } from 'express';
import { ScheduleRentalService } from '../services/schedule-rental.service';
import { container } from 'tsyringe';

export class ScheduleRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const scheduleRentalService = container.resolve(ScheduleRentalService);
    await scheduleRentalService.execute(data);
    return response.status(201).send();
  }
}
