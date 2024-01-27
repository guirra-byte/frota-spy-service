import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { EventEmitter } from 'stream';

export class FollowScheduleRentalController {
  async handle(request: Request, response: Response) {
    const nodeEvents = container.resolve(EventEmitter);
    const requestOwner = request.params['owner_id'];

    nodeEvents.on('try_rental', (args: any) => {
      response.write(args, (_err: Error | null | undefined) => {
        if (_err) {
          console.log(_err.message);
        }

        const { req_owner, req_status } = args;
        if (req_owner === requestOwner) {
          response.end(`Status da sua solicitação: ${req_status}`);
        }
      });
    });
  }
}
