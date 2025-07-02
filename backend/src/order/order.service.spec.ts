import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FilmsPostgreSQLRepository } from '../repository/filmsPostgeSQL.repository';

describe('OrderService', () => {
  let service: OrderService;
  let filmsRepository: FilmsPostgreSQLRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: 'FILMS_REPOSITORY',
          useValue: filmsRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
