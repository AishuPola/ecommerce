import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schema/cart.schema';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,

    private productService: ProductsService,
  ) {}

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
      const product = await this.productService.getProductById(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      cart.items.push({
        product: new Types.ObjectId(productId),
        quantity,
        price: product.price,
      });
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
      // cart.items = [];
      // await cart.save();
      await this.cartModel.deleteOne({ user: userId });
      return { message: 'Cart cleared successfully' };
    }
    return { message: 'Cart does not exist or is already empty' };
  }

  // In src/cart/cart.service.ts
  async getCartByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product')
      .exec();
    return cart; // This should now return a populated cart document
  }
}
