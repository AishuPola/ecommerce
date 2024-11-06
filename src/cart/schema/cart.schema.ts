import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';

@Schema()
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product: Types.ObjectId;

  @Prop({ required: true, default: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

@Schema()
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  user: Types.ObjectId;

  @Prop({ type: [CartItem], default: [] }) // Ensure it's an array with a default value
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
export const CartItemSchema = SchemaFactory.createForClass(CartItem);
