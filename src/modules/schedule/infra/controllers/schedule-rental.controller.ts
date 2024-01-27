import { Response, Request } from 'express';
import { ScheduleRentalService } from '../services/schedule-rental.service';
import { container } from 'tsyringe';

export class ScheduleRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const scheduleRentalService = container.resolve(ScheduleRentalService);
    await scheduleRentalService.execute(data);

    const requestOwner = request.params['owner_id'];
    response.writeHead(202, {
      location: `${request.baseUrl}/${requestOwner}/follow`,
    });

    return response
      .status(202)
      .send(`Sua solicitação está sendo processada...`);
  }
}
