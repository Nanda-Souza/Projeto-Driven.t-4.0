import { notFoundError, roomCapacityError, bookingError } from '@/errors';
import bookingsRepository from '@/repositories/bookings-repository';
import roomsRepository from '@/repositories/rooms-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { BookingParams } from '@/protocols';

async function checkRoomAvailability(roomId: number) {
  const room = await roomsRepository.findRoomById(roomId);

  if (!room) throw notFoundError();

  if (room.Booking.length === room.capacity) {
    throw roomCapacityError();
  }

  return;
}

async function checkEnrollmentAndTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== 'PAID') throw bookingError();

  return;
}

async function getBookingByUserId(userId: number) {
  const booking = await bookingsRepository.findBookingByUserId(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function bookingReservation(userId: number, roomId: number) {
  await checkEnrollmentAndTicket(userId);

  await checkRoomAvailability(roomId);

  const booking: BookingParams = {
    userId,
    roomId,
  };

  const reservation = await bookingsRepository.createBooking(booking);

  return reservation;
}

export default {
  getBookingByUserId,
  bookingReservation,
};
