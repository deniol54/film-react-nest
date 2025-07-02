import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';

import { OrderService } from './order.service';
import { GetOrderDTO } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue({
        createOrder: jest.fn().mockResolvedValue({
          items: [
            {
              film: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
              session: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
              daytime: '2023-05-29T10:30:00.001Z',
              day: 'Monday',
              time: '10:30',
              row: 2,
              seat: 5,
              price: 350,
            },
          ],
          total: 1,
        }),
      })
      .compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('.createOrder() should be create an order and return the result', async () => {
    const orderData: GetOrderDTO = {
      tickets: [
        {
          film: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          session: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
          daytime: '2023-05-29T10:30:00.001Z',
          day: 'Monday',
          time: '10:30',
          row: 2,
          seat: 5,
          price: 350,
        },
      ],
      email: 'test@example.com',
      phone: '+79001234567',
    };
    const orderComplete = await controller.createOrder(orderData);
    const result = {
      items: orderData.tickets,
      total: orderData.tickets.length,
    };
    expect(orderComplete).toEqual(result);
    expect(service.createOrder).toHaveBeenCalledWith(orderData);
  });
});
