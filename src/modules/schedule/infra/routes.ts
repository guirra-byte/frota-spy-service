import { Request, Response, Router } from 'express';
import { ScheduleRentalController } from './controllers/schedule-rental.controller';

const scheduleRentalRoutes = Router();
const scheduleRentalController = new ScheduleRentalController();

scheduleRentalRoutes.post('/', async (request: Request, response: Response) => {
  await scheduleRentalController.handle(request, response);
});

scheduleRentalRoutes.get(
  '/follow',
  async (request: Request, response: Response) => {
    //The server response gonna preset next requests headers;
    response.writeHead(200, 'Conexão realizada com sucesso!', {
      'cache-control': 'no-cache',
      'content-type': 'text/event-stream',
      connection: 'keep-alive',
    });
  },
);

export { scheduleRentalRoutes };
