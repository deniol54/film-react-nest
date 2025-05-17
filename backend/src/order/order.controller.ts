import { Controller, Post } from '@nestjs/common';

@Controller('order')
export class OrderController {
  @Post() // а этот для запроса POST /films
  create(): string {
    return 'Это метод создания нового фильма';
  }
}
