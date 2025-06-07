import { Injectable } from '@nestjs/common';
import { FilmsMongoDbRepository } from '../repository/filmsMongoDb.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsMongoDbRepository) {}

  async getAllFilms() {
    return this.filmsRepository.findAllFilms();
  }

  async getScheduleFilm(id: string) {
    return await this.filmsRepository.findAllSchedulesById(id);
  }
}
