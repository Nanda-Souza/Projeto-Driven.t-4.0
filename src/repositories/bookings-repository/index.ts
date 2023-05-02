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

async function createBooking(params: BookingParams) {
  return prisma.booking.create({
    data: {
      ...params,
    },
  });
}

export default {
  findBookingByUserId,
  createBooking,
};
