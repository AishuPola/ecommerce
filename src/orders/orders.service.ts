import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cart } from 'src/cart/schema/cart.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private cartservice: CartService,
  ) {}
  async placeOrder(userId: string) {
    // Find the user's cart and populate the product details in items
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty or does not exist');
    }

    // Calculate the total amount using the populated product data
    const totalAmount = cart.items.reduce((sum, item) => {
      const productPrice = item.price; // Access price from populated product
      return sum + productPrice * item.quantity;
    }, 0);

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      productId: item.product._id, // Access populated product ID
      quantity: item.quantity,
    }));

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
    return { message: 'Order placed successfully', orderId: newOrder._id };
  }
}
