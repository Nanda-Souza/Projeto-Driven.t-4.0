import { prisma } from '@/config';
import { BookingParams } from '@/protocols';

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findBookingById(bookingId: number) {
  return prisma.booking.findFirst({
    where: { id: bookingId },
  });
}

async function createBooking(params: BookingParams) {
  return prisma.booking.create({
    data: {
      ...params,
    },
  });
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
  });
}

export default {
  findBookingByUserId,
  createBooking,
  updateBooking,
  findBookingById,
};
