import { Request, Response, Router } from 'express';
import { ScheduleRentalController } from './controllers/schedule-rental.controller';

const scheduleRentalRoutes = Router();
const scheduleRentalController = new ScheduleRentalController();

scheduleRentalRoutes.post('/', async (request: Request, response: Response) => {
  await scheduleRentalController.handle(request, response);
});

export { scheduleRentalRoutes };
