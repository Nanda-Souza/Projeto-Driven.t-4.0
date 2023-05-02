import { Router } from 'express';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { roomsSchema } from '@/schemas/rooms-schemas';
import { bookingsSchema } from '@/schemas/booking-schemas';
import { getBooking, postBooking, putBooking } from '@/controllers';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBody(roomsSchema), postBooking)
  .put('/:bookingId', validateBody(roomsSchema), validateParams(bookingsSchema), putBooking);

export { bookingsRouter };
