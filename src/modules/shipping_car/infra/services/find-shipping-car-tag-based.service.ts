import { inject } from 'tsyringe';
import { IShippingCarData } from '../db/abstract/Ishipping-car.data';
import { ShippingCar } from '../../domain/entities/shipping.entity';
import { Tag } from '../../../../shared/domain/entities/tag.entity';
import { HireStatus } from '../../domain/enums/shipping-rover-status.enum';

export class FindShippingCarTagBasedService {
  constructor(
    @inject('ShippingCarDatasource')
    private shippingCarDatasource: IShippingCarData,
  ) { }

  async execute(tags: Tag[]) {
    const shippingCars = await this.shippingCarDatasource.findAll();

    if (shippingCars.length === 0) {
      throw new Error('Não possui carros registrados em sua frota!');
    }

    const tagBasedData = async (
      remaining: ShippingCar[],
      currentIndex: number = 0,
      currentTags: Record<string, Tag[]> = {},
    ) => {
      for (let index = currentIndex; index < remaining.length; index++) {
        for (const tag of tags) {
          const matchingTag = remaining[index].tags.find(
            (_tag) => _tag === tag,
          );

          const [inCaseOfAvailable, inCaseOfUnderSupport] = [
            remaining[index].status === HireStatus['AVAILABLE'],
            remaining[index].status === HireStatus['UNDER_SUPPORT'],
          ];

          if ((inCaseOfAvailable || inCaseOfUnderSupport) && matchingTag) {
            if (currentTags[`${remaining[index].plate}`]) {
              currentTags[`${remaining[index].plate}`].push(tag);
            } else {
              currentTags[`${remaining[index].plate}`] = [tag];
            }
          } else {
            const unmatching = remaining
              .slice(0, index)
              .concat(remaining.slice(index + 1));

            if (remaining[index + 1]) {
              tagBasedData(unmatching, (currentIndex += 1), currentTags);
            }
          }
        }
      }
    };

    const matchingData = await tagBasedData(shippingCars);
    return matchingData;
  }
}
