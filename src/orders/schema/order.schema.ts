// order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [{ productId: Types.ObjectId, quantity: Number }],
    required: true,
  })
  items: { productId: Types.ObjectId; quantity: number }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
