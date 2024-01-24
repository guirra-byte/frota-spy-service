import cron from 'node-cron';
import { container } from 'tsyringe';
import { SchedullingCheckShippingInfractionService } from '../services/schedulling-check-shipping-infraction.service';

cron.schedule(
  `${process.env.CRON_EXPRESSION}`,
  async () => {
    const schedullingCheckShippingInfractionService = container.resolve(
      SchedullingCheckShippingInfractionService,
    );

    await schedullingCheckShippingInfractionService.execute();
  },
  {
    timezone: 'America/Sao_Paulo',
    scheduled: true,
    runOnInit: true,
    name: 'Check Shipping Infractions',
  },
);
