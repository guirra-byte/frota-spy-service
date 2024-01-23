import 'reflect-metadata';
import { app } from './app/app';
import express from 'express';
import { shippingRoverRoutes } from '../../modules/shipping_car/infra/routes';
import { scheduleRentalRoutes } from '../../modules/schedule/infra/routes';

app.use(express.json());
const port = 1102;

app.use('/shipping_rover', shippingRoverRoutes);
app.use('/schedule_rental', scheduleRentalRoutes);

app.listen(port, () => {
  console.log(`The application already is running on port ${port}.`);
});
