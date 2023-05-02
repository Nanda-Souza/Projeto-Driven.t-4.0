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

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { roomId } = req.body as { roomId: number };

    const booking = await bookingsService.bookingReservation(userId, roomId);

    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (e) {
    next(e);
  }
}
