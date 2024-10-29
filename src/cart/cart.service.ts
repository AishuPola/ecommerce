import { Injectable } from '@nestjs/common';
import { Cart } from './schema/cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}
  addProductToCart(userId: string, productId: string, quantity: number) {}
}
