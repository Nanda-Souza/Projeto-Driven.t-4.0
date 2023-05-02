import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { roomsSchema } from '@/schemas/rooms-schemas';
import { getBooking, postBooking } from '@/controllers';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getBooking).post('/', validateBody(roomsSchema), postBooking);

export { bookingsRouter };
