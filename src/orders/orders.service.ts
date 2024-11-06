import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';

import { Cart } from 'src/cart/schema/cart.schema';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private cartservice: CartService,
    private productsService: ProductsService,
  ) {}
  async placeOrder(userId: string) {
    // Find the user's cart and populate the product details in items
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty or does not exist');
    }

    // Validate stock for each item in the cart
    for (const item of cart.items) {
      const product = item.product as Product;
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Product ${product.name} has only ${product.stock} items in stock.`,
        );
      }
    }

    // Calculate the total amount using the populated product data
    // const totalAmount = cart.items.reduce((sum, item) => {
    //   const productPrice = item.price; // Access price from populated product
    //   return sum + productPrice * item.quantity;
    // }, 0);

    let totalAmount = 0;
    for (const item of cart.items) {
      const product = item.product as Product;
      const discountedPrice = await this.productsService.getDiscountedPrice(
        product._id.toString(),
        item.quantity,
      );
      totalAmount += discountedPrice;
    }

    // Prepare order items
    // const orderItems = cart.items.map((item) => ({
    //   productId: item.product._id, // Access populated product ID
    //   quantity: item.quantity,
    // }));

    // Prepare order items and reduce stock
    const orderItems = [];
    for (const item of cart.items) {
      const product = item.product as Product;

      // Deduct the quantity from the product's stock
      await this.productsService.updateProductStock(
        product._id.toString(),
        -item.quantity,
      );

      // Prepare order item details
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
      });
    }
    // Create and save the order
    const newOrder = new this.orderModel({
      userId,
      items: orderItems,
      totalAmount,
      status: 'Pending',
    });

    await newOrder.save();

    // await this.cartModel.updateOne({ user: userId }, { $set: { items: [] } });
    await this.cartservice.clearCartItems(userId);
    return {
      message: 'Order placed successfully',
      orderId: newOrder._id,
      totalAmount,
    };
  }
}
