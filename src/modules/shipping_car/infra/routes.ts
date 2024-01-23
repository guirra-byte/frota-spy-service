import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateShippingCarController } from './controllers/create-shipping-car.controller';

const shippingRoverRoutes = Router();
const createShippingCarController = container.resolve(
  CreateShippingCarController,
);

shippingRoverRoutes.post('/', async (request: Request, response: Response) => {
  await createShippingCarController.handle(request, response);
});

export { shippingRoverRoutes };
