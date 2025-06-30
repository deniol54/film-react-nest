import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsPostgreSQLRepository } from '../repository/filmsPostgeSQL.repository';

describe('FilmsService', () => {
  let service: FilmsService;
  let filmsRepository: FilmsPostgreSQLRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: 'FILMS_REPOSITORY',
          useValue: filmsRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
