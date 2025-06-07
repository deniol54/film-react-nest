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
    for (const ticket of tickets) {
      await this.filmsRepository.findSchedulesById(ticket.film, ticket.session);
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
      this.filmsRepository.updatePlaces(ticket.film, ticket.session, place);
    }
    return { items: tickets, total: tickets.length };
  }
}
