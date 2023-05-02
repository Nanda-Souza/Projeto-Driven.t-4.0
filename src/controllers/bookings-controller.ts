import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;

    const booking = await bookingsService.getBookingByUserId(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (e) {
    next(e);
  }
}

/*export async function paymentProcess(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId, cardData } = req.body;

  try {
    if (!ticketId || !cardData) return res.sendStatus(httpStatus.BAD_REQUEST);

    const payment = await paymentsService.paymentProcess(ticketId, userId, cardData);
    if (!payment) return res.sendStatus(httpStatus.NOT_FOUND);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
*/
