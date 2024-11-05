import { Controller, Delete, Post, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';

import { AuthGuard } from '@nestjs/passport';
import { CartService } from 'src/cart/cart.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private orderservice: OrdersService,
    private cartService: CartService,
  ) {}
}
