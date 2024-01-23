import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindShippingCarTagBasedService } from '../services/find-shipping-car-tag-based.service';

export class FindShippingCarTagBasedController {
  async handle(request: Request, response: Response) {
    const data = request.body;

    const findShippingCarTagBasedService = container.resolve(
      FindShippingCarTagBasedService,
    );

    const tagBasedData = findShippingCarTagBasedService.execute(data);
    return response.status(200).send({ tagBasedData });
  }
}
