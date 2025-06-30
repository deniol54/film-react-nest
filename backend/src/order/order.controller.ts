import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetOrderDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post() // а этот для запроса POST /films
  createOrder(@Body() orderData: GetOrderDTO) {
    return this.orderService.createOrder(orderData);
  }
}
