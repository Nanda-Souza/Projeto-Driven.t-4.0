import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createUser,
  createBooking,
  createEnrollmentWithAddress,
  createTicketTypeRemote,
  createTicketTypeWithoutHotel,
  createTicketTypeWithHotel,
  createTicket,
  createHotel,
  createRoomWithHotelId,
  createFullRoom,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 if request does not have a roomId', async () => {
      const token = await generateValidToken();

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 if provided roomId is not a number', async () => {
      const token = await generateValidToken();

      const body = { roomId: faker.lorem.word() };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 403 if ticket type is remote', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketTypeRemote();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const body = { roomId: faker.datatype.number() };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if ticket does not include a hotel', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketTypeWithoutHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const body = { roomId: faker.datatype.number() };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if ticket was not paid', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketTypeWithHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const body = { roomId: faker.datatype.number() };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if room is full', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketTypeWithHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();

      const room = await createFullRoom(hotel.id);

      await createBooking(user.id, room.id);

      const body = { roomId: room.id };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 if room does not exists', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketTypeWithHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();

      await createRoomWithHotelId(hotel.id);

      const body = { roomId: 0 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 returning the bookingId', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketTypeWithHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();

      const room = await createRoomWithHotelId(hotel.id);

      const body = { roomId: room.id };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ bookingId: expect.any(Number) });
    });
  });
});

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if user does not have a booking', async () => {
      const token = await generateValidToken();

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and return the created booking', async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketTypeWithHotel();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();

      const room = await createRoomWithHotelId(hotel.id);

      const booking = await createBooking(user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          ...room,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});
