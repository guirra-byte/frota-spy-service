import { ICreateShippingRoverDTO } from '../../domain/dtos/Icreate-shipping-rover.dto';
import { ShippingCar } from '../../domain/entities/shipping.entity';

export class CreateShippingCarService {
  private shippingCarRepository: ShippingCar[] = [];

  async execute(data: ICreateShippingRoverDTO) {
    const shippingRoverAlreadyExists = this.shippingCarRepository.find(
      (rover) => rover.plate === data.plate,
    );

    if (shippingRoverAlreadyExists) {
      throw new Error('Não foi possível encontrar o carro!');
    }

    const car = new ShippingCar(data);
    this.shippingCarRepository.push(car);

    return car;
  }
}
