import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { EventEmitter } from 'stream';

export class FollowScheduleRentalController {
  async handle(request: Request, response: Response) {
    const nodeEvents = container.resolve(EventEmitter);
    nodeEvents.on('try_schedule', (args: any) => {
      response.write(args, (_err: Error | null | undefined) => {
        if (_err) {
          console.log(_err.message);
        }
      });
    });
  }
}
