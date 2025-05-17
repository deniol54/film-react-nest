import { Injectable } from '@nestjs/common';
import { FilmsMongoDbRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsMongoDbRepository) {}

  async getAllFilms() {
    return this.filmsRepository.findAllFilms();
  }

  async getScheduleFilm(id: string) {
    return await this.filmsRepository.findScheduleById(id);
  }
}
