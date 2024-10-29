import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    },
  ])
  items: { product: Product; quantity: number }[];

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
