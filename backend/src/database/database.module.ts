import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsMongoDbRepository } from '../repository/filmsMongoDb.repository';
import { FilmsPostgreSQLRepository } from 'src/repository/filmsPostgeSQL.repository';
import { applicationConfig } from '../app.config.provider';
import { Film, FilmSchema } from '../films/schemas/film.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from '../films/entity/schedule.entity';
import { FilmEntity } from '../films/entity/film.entity';

@Module({})
export class DatabaseModule {
  static register(dbms: string): DynamicModule {
    const providers = [];
    const imports = [];

    switch (dbms) {
      case 'mongodb':
        imports.push(MongooseModule.forRoot(applicationConfig.DATABASE_URL));
        imports.push(
          MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
        );
        providers.push(FilmsMongoDbRepository);
        break;

      case 'postgres':
        imports.push(
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: applicationConfig.DATABASE_HOST,
            port: +applicationConfig.DATABASE_PORT,
            username: applicationConfig.DATABASE_USERNAME,
            password: applicationConfig.DATABASE_PASSWORD,
            database: applicationConfig.DATABASE_NAME,
            entities: [FilmEntity, ScheduleEntity],
            synchronize: false,
          }),
        );
        imports.push(TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]));
        providers.push(FilmsPostgreSQLRepository);
        break;
    }
    return {
      module: DatabaseModule,
      imports: imports,
      providers: providers,
      exports: providers,
    };
  }
}
