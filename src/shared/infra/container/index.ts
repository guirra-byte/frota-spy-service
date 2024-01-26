import { container } from 'tsyringe';
import { QueueManagerProvider } from '../providers/queue-manager-provider/implementations/queue-manager-provider.implementations';
import { VehicleInfractionProvider } from '../providers/vehicle-infraction-provider/implementations/vehicle-infraction-provider.implementation';
import { DateProvider } from '../providers/date-provider/implementations/date-provider.implementations';
import { IQueueManagerProvider } from '../providers/queue-manager-provider/interfaces/Iqueue-manager-provider.interface';
import { IVehicleInfractionProvider } from '../providers/vehicle-infraction-provider/interfaces/Ivehicle-infraction-provider.interface';
import { IDateProvider } from '../providers/date-provider/interfaces/Idate-provider.interface';
import { ScheduleDatasource } from '../../../modules/schedule/infra/db/implementations/schedule.datasource';
import { IScheduleData } from '../../../modules/schedule/infra/db/abstract/Ischedule.data';
import { IShippingCarData } from '../../../modules/shipping_car/infra/db/abstract/Ishipping-car.data';
import { ShippingCarDatasource } from '../../../modules/shipping_car/infra/db/implementations/shipping-car.datasource';
import { ScheduleRentalListenerController } from '../../../modules/schedule/infra/controllers/schedule-rental-listener.controller';
import EventEmitter from 'node:events';

// Datasources
container.registerSingleton<IScheduleData>(
  'ScheduleDatasource',
  ScheduleDatasource,
);

container.registerSingleton<IShippingCarData>(
  'ShippingCarDatasource',
  ShippingCarDatasource,
);

// Providers
container.registerInstance<IQueueManagerProvider>(
  'QueueManagerProvider',
  new QueueManagerProvider(),
);

container.registerInstance<IVehicleInfractionProvider>(
  'VehicleInfractionProvider',
  new VehicleInfractionProvider(),
);

container.registerInstance<IDateProvider>('DateProvider', new DateProvider());

container.registerInstance('NodeEvents', new EventEmitter());
