import { Response, Request } from 'express';
import { CreateShippingCarService } from '../services/create-shipping-car.service';

export class CreateShippingCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const createShippingCarService = new CreateShippingCarService();
    const car = await createShippingCarService.execute(data);
    return response.status(201).json({ car });
  }
}
