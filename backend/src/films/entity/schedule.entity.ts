import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FilmEntity } from './film.entity';

@Entity()
export class ScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  daytime: string;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column()
  price: number;

  @Column()
  taken: string[];

  @ManyToOne(() => FilmEntity, (film) => film.id)
  @JoinColumn()
  filmId: FilmEntity;
}
