import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from './schema/cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { addItemDto } from './dto/additem.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}
  addProductToCart(addItemDto: addItemDto) {
    const { userId, productId, quantity } = addItemDto;
    const cart = this.cartModel.findOneAndUpdate(
      { user: userId },
      {
        $setOnInsert: { user: userId },
        $inc: { [`items.$[elem].quantity`]: quantity },
      },
      {
        upsert: true,
        new: true,
        arrayFilters: [{ 'elem.product': productId }],
      },
    );
    if (!cart) {
      throw new NotFoundException('CART NOT FOUND');
    }
    return cart;
  }
}
