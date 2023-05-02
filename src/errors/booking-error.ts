import { ApplicationError } from '@/protocols';

export function bookingError(): ApplicationError {
  return {
    name: 'BookingError',
    message: 'Unable to complete action due invalid booking, ticket type or payment status!',
  };
}
