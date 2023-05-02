import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking } from '@/controllers';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getBooking);
//.post('/process', paymentProcess);

export { bookingsRouter };
