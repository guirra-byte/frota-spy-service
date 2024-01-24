import { Job, Worker } from 'bullmq';
import { ScheduleRental } from '../../domain/entities/schedule-rental.entity';
import { IScheduleRentalDTO } from '../../domain/dtos/Ischedule-rental.dto';
import { HireStatus } from '../../../shipping_car/domain/enums/shipping-rover-status.enum';
import { ScheduleRentalStatus } from '../../domain/enums/schedule-rental-status.enum';

import { IWorkerData } from '../../../../shared/domain/interfaces/Iworker.interface';
import { IScheduleData } from '../db/abstract/Ischedule.data';
import { inject } from 'tsyringe';
import { IShippingCarData } from '../../../shipping_car/infra/db/abstract/Ishipping-car.data';
import { ILodgerNode, lodgersLinkedList } from '../lodgers-linked-list';

export class ScheduleRentalWorker extends Worker {
  constructor(
    @inject('ShippingCarDatasource')
    private shippingCarDatasource: IShippingCarData,
    @inject('ScheduleDatasource') private scheduleDatasource: IScheduleData,

    props: IWorkerData,
  ) {
    super(
      props.name,
      async (job: Job<IScheduleRentalDTO>) => {
        switch (job.name) {
          case 'rental':
            async () => {
              const claimShippingCar =
                await this.shippingCarDatasource.findCarByPlate(
                  job.data.rover.plate,
                );

              if (!claimShippingCar) {
                this.emit(
                  'failed',
                  job,
                  new Error(`Não foi possivel encontrar o carro 
                  com placa ${job.data.rover.plate}!`),
                  '',
                );
              }

              if (claimShippingCar?.status !== HireStatus['AVAILABLE']) {
                this.emit(
                  'failed',
                  job,
                  new Error(
                    `${claimShippingCar?.name} com placa 
                      ${claimShippingCar?.plate}
                      não está disponível no momento!`,
                  ),
                  '',
                );
              }

              const scheduleRental = new ScheduleRental(job.data);
              const insertInShippingCarHistory = async (
                carLodgersHistory: ILodgerNode | null,
              ) => {
                if (carLodgersHistory) {
                  if (carLodgersHistory.next !== null) {
                    insertInShippingCarHistory(carLodgersHistory.next);
                  } else {
                    carLodgersHistory.next = {
                      lodger: scheduleRental.lodger,
                      next: null,
                    };

                    return;
                  }
                }
              };

              if (claimShippingCar) {
                if (claimShippingCar.lodgers) {
                  const lodgersNode = await lodgersLinkedList(
                    claimShippingCar.lodgers,
                  );

                  if (lodgersNode) {
                    await insertInShippingCarHistory(lodgersNode);
                  }
                } else {
                  claimShippingCar.lodgers = [scheduleRental.lodger];
                }
              }

              await this.scheduleDatasource.save(scheduleRental);

              return;
            };
          case 'cancel_rental':
            async () => {
              const claimRental =
                await this.scheduleDatasource.findUsageScheduleByPlate(
                  job.data.rover.plate,
                );

              if (!claimRental) {
              } else {
                await this.scheduleDatasource.updateRentalStatus(
                  claimRental._id,
                  ScheduleRentalStatus['CANCELLED'],
                );
              }

              return;
            };
        }
      },
      {
        autorun: true,
        concurrency: 50,
      },
    );
  }
}
