import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from 'src/cart/cart.module';

import { ProductsModule } from 'src/products/products.module';
import { Order, OrderSchema } from './schema/order.schema';
import { Cart, CartItemSchema } from 'src/cart/schema/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartItemSchema }]),
    CartModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
