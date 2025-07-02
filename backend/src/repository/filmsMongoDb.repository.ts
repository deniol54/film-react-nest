import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAllSchedulesById(
    filmId: string,
  ): Promise<{ total: number; items: GetScheduleDTO[] }> {
    const film = await this.findFilmById(filmId); //используем обычные методы Mongoose-документов
    const schedule = film.schedule;
    return {
      total: schedule.length,
      items: schedule.map(this.getScheludeMapperFn()),
    };
  }

  async findFilmById(filmId: string): Promise<GetFilmDTO> {
    try {
      const film = await this.filmModel.findOne({ id: filmId });
      const mapper = this.getFilmMapperFn();
      return mapper(film);
    } catch {
      throw new NotFoundException(`Фильм с ${filmId} не найден`);
    }
  }

  async findSchedulesById(
    filmId: string,
    scheduleId: string,
  ): Promise<GetScheduleDTO> {
    const { items } = await this.findAllSchedulesById(filmId);
    const schedule = items.find((el) => el.id === scheduleId);
    if (!schedule) {
      throw new NotFoundException(`Сеанса с ${scheduleId} не найден`);
    }
    return schedule;
  }

  async checkPlace(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<boolean> {
    const res = await this.filmModel.find({
      id: filmId,
      schedule: {
        $elemMatch: {
          id: scheduleId,
          taken: place,
        },
      },
    });
    return Boolean(res.length);
  }

  async updatePlaces(
    filmId: string,
    scheduleId: string,
    place: string[],
  ): Promise<void> {
    const places = place.join(',');
    await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: {
          $elemMatch: {
            id: scheduleId,
          },
        },
      },
      {
        $push: { 'schedule.$.taken': places },
      },
    );
  }
}
