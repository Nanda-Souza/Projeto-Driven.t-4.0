import { ApplicationError } from '@/protocols';

export function bookingError(): ApplicationError {
  return {
    name: 'BookingError',
    message: 'Unable to complete booking due invalid ticket type or not being paid!',
  };
}
