import Joi from 'joi';
import { InputBookingParam } from '@/protocols';

export const bookingsSchema = Joi.object<InputBookingParam>({
  bookingId: Joi.number().required(),
});
