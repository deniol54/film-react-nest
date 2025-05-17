import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsMongoDbRepository } from '../repository/films.repository';
import { applicationConfig } from '../app.config.provider';
import { Film, FilmSchema } from '../films/schemas/film.schema';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRoot(applicationConfig.DATABASE_URL),
        MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
      ],
      providers: [FilmsMongoDbRepository],
      exports: [FilmsMongoDbRepository],
    };
  }
}
