import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schema/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async addItemToCart(userId: string, productId: string, quantity: number) {
    let cart = await this.cartModel.findOne({ user: userId });

    // If the cart does not exist, create it with an empty items array
    if (!cart) {
      cart = new this.cartModel({
        user: userId,
        items: [], // Initialize items as an empty array
      });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      // If item exists, update the quantity
      existingItem.quantity += quantity;
    } else {
      // If item does not exist, push a new item into the items array
      cart.items.push({ product: new Types.ObjectId(productId), quantity });
    }

    // Save the cart with the updated items array
    await cart.save();
    return cart;
  }

  async getItemsInCart(userId: string) {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product');
    if (!cart) {
      return { message: 'No items in cart', items: [] };
    }
    return cart.items;
  }
  async clearCartItems(userId: string) {
    const cart = await this.cartModel.findOne({ user: userId });

    if (cart) {
      cart.items = [];
      await cart.save();
      return { message: 'Cart cleared successfully' };
    }
    return { message: 'Cart is already empty' };
  }
}
