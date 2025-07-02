import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilms = [
    {
      id: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
      rating: 8,
      director: 'Амелия Хьюз',
      tags: 'Рекомендуемые',
      image: '/bg6s.jpg',
      cover: '/bg6c.jpg',
      title: 'Сон в летний день',
      about:
        'Фэнтези-фильм о группе друзей попавших в волшебный лес, где время остановилось.',
      description:
        'Причудливый фэнтези-фильм, действие которого происходит в волшебном лесу, где время остановилось. Группа друзей натыкается на это заколдованное царство и поначалу проникается беззаботным духом обитателей, но потом друзьям приходится разойтись. А как встретиться снова, если нет ни времени, ни места встречи?',
    },
  ];

  const mockSchelude = [
    {
      id: '2d794723-eadc-43ea-b82b-268f0178fb43',
      daytime: '2024-06-28T14:00:53+03:00',
      hall: 1,
      rows: 5,
      seats: 10,
      price: 350,
      taken: '',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue({
        getAllFilms: jest.fn().mockReturnValue({
          total: mockFilms.length,
          items: mockFilms,
        }),
        getScheduleFilm: jest.fn().mockReturnValue({
          total: mockSchelude.length,
          items: mockSchelude,
        }),
      })
      .compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('.getFilms() should be return all films', async () => {
    const result = await controller.getFilms();
    expect(result).toEqual({
      total: mockFilms.length,
      items: mockFilms,
    });
    expect(service.getAllFilms).toHaveBeenCalled();
  });

  it('.getSchedule() should be return all schedule for film', async () => {
    const result = await controller.getSchedule('1');
    expect(result).toEqual({
      total: mockSchelude.length,
      items: mockSchelude,
    });
    expect(service.getScheduleFilm).toHaveBeenCalledWith('1');
  });
});
