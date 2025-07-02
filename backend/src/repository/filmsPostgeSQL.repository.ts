import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetFilmDTO, GetScheduleDTO } from '../films/dto/films.dto';
import { FilmEntity } from '../films/entity/film.entity';
import { ScheduleEntity } from '../films/entity/schedule.entity';

@Injectable()
export class FilmsPostgreSQLRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
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
    const items = await this.filmRepository.find(); //используем обычные методы Mongoose-документов
    const total = await this.filmRepository.count();
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
      const film = await this.filmRepository.findOne({
        where: {
          id: filmId,
        },
        relations: ['schedule'],
      });
      const mapper = this.getFilmMapperFn();
      return mapper(film);
    } catch (error) {
      throw new NotFoundException(`Фильм с ${filmId} не найден`);
    }
  }

  async findSchedulesById(
    filmId: string,
    scheduleId: string,
  ): Promise<GetScheduleDTO> {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        id: scheduleId,
        filmId: filmId,
      },
    });
    if (!schedule) {
      throw new NotFoundException(`Сеанса с ${scheduleId} не найден`);
    }
    const mapper = this.getScheludeMapperFn();
    return mapper(schedule);
  }

  async checkPlace(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<boolean> {
    const schedule = await this.findSchedulesById(filmId, scheduleId);
    if (schedule.taken.includes(place)) {
      return true;
    }
    return false;
  }

  async updatePlaces(
    filmId: string,
    scheduleId: string,
    places: string[],
  ): Promise<void> {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: {
          id: scheduleId,
          filmId: filmId,
        },
      });
      const currentTaken = schedule.taken ? schedule.taken.split(',') : [];
      const taken = [...currentTaken, ...places];
      schedule.taken = taken.join(',');
      await this.scheduleRepository.save(schedule);
    } catch (error) {
      throw new InternalServerErrorException('Ошибка добавления');
    }
  }
}
