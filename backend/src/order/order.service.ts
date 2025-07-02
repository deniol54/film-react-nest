import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { FilmsMongoDbRepository } from '../repository/filmsMongoDb.repository';
import { GetOrderDTO, GetTicketDTO } from './dto/order.dto';
import { FilmsPostgreSQLRepository } from '../repository/filmsPostgeSQL.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmsRepository:
      | FilmsMongoDbRepository
      | FilmsPostgreSQLRepository,
  ) {}

  async createOrder(
    orderData: GetOrderDTO,
  ): Promise<{ items: GetTicketDTO[]; total: number }> {
    const tickets = orderData.tickets;
    const places: string[] = [];
    const film = tickets[0].film;
    const session = tickets[0].session;
    for (const ticket of tickets) {
      const place = `${ticket.row}:${ticket.seat}`;
      if (
        await this.filmsRepository.checkPlace(
          ticket.film,
          ticket.session,
          place,
        )
      ) {
        throw new BadRequestException(`Место ${place} уже забронировано`);
      }
      places.push(place);
    }
    this.filmsRepository.updatePlaces(film, session, places);
    return { items: tickets, total: tickets.length };
  }
}
