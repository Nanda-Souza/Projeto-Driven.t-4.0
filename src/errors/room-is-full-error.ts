import { ApplicationError } from '@/protocols';

export function roomCapacityError(): ApplicationError {
  return {
    name: 'RoomCapacityError',
    message: 'The room is full!',
  };
}
