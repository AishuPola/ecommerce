import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true, default: 1 })
  quantity: number;
}

@Schema()
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  user: Types.ObjectId;

  @Prop({ type: [CartItem], default: [] }) // Ensure it's an array with a default value
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
