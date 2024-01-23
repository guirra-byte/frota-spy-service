import { Job, Worker } from 'bullmq';
import { IWorkerData } from '../../../../shared/domain/interfaces/Iworker.interface';
import { IDriveInfractionOwnership } from './check-infractions-launch.worker';

export class DriveInfractionOwnershipWorker extends Worker {
  constructor(props: IWorkerData) {
    super(
      props.name,
      async (job: Job<IDriveInfractionOwnership[]>) => {
        switch (job.name) {
          case 'drive_infraction_owner':
          //Service de disparo de mensagens (WhatsApp ou Email);
          //Envio do boleto referente ao valor da infração;
        }
      },
      {
        ...props.options,
        autorun: true,
      },
    );
  }
}
