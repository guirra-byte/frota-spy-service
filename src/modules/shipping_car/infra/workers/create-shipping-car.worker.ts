import { Job, Worker } from 'bullmq';
import { inject } from 'tsyringe';
import { IWorkerData } from '../../../../shared/domain/interfaces/Iworker.interface';
import { IShippingCarData } from '../db/abstract/Ishipping-car.data';

export class CreateShippingCarWorker extends Worker {
  constructor(
    @inject('ShippingDatasource')
    private shippingDatasource: IShippingCarData,

    props: IWorkerData,
  ) {
    super(
      props.name,
      async (job: Job<any>) => {
        switch (job.name) {
          case 'create_shipping_car':
            await this.shippingDatasource.save(job.data);
        }
      },
      { autorun: true },
    );
  }
}
