import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetFilmDTO, GetScheduleDTO } from '../films/dto/films.dto';
import { Film } from '../films/schemas/film.schema';

@Injectable()
export class FilmsMongoDbRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  private getFilmMapperFn(): (Film) => GetFilmDTO {
    return (root) => {
      return {
        id: root.id,
        //далее конвертация сущности в DTO
        rating: root.rating,
        director: root.director,
        tags: root.tags,
        image: root.image,
        cover: root.cover,
        title: root.title,
        about: root.about,
        description: root.description,
        schedule: root.schedule,
      };
    };
  }

  private getScheludeMapperFn(): (Schedule) => GetScheduleDTO {
    return (root) => {
      return {
        id: root.id,
        //далее конвертация сущности в DTO
        daytime: root.daytime,
        hall: root.hall,
        rows: root.rows,
        seats: root.seats,
        price: root.price,
        taken: root.taken,
      };
    };
  }

  async findAllFilms(): Promise<{ total: number; items: GetFilmDTO[] }> {
    const items = await this.filmModel.find({}); //используем обычные методы Mongoose-документов
    const total = await this.filmModel.countDocuments({});
    return {
      total,
      items: items.map(this.getFilmMapperFn()),
    };
  }

  async findScheduleById(
    filmId: string,
  ): Promise<{ total: number; items: GetScheduleDTO[] }> {
    const film = await this.filmModel.findOne({ id: filmId }); //используем обычные методы Mongoose-документов
    const schedule = film.schedule;
    return {
      total: schedule.length,
      items: schedule.map(this.getScheludeMapperFn()),
    };
  }
}
