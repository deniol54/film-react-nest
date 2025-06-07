import { Injectable } from '@nestjs/common';
import { FilmsMongoDbRepository } from '../repository/filmsMongoDb.repository';
import { FilmsPostgreSQLRepository } from '../repository/filmsPostgeSQL.repository';

@Injectable()
export class FilmsService {
  constructor(
    private readonly filmsRepository: // | FilmsMongoDbRepository
    FilmsPostgreSQLRepository,
  ) {}

  async getAllFilms() {
    return this.filmsRepository.findAllFilms();
  }

  async getScheduleFilm(id: string) {
    return await this.filmsRepository.findAllSchedulesById(id);
  }
}
