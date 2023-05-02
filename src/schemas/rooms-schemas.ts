import Joi from 'joi';
import { InputRoomBody } from '@/protocols';

export const roomsSchema = Joi.object<InputRoomBody>({
  roomId: Joi.number().required(),
});
