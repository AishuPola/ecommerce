import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  rating: number;
  offer?: {
    isActive: boolean;
    discountPercentage: number;
  };
  imageUrl: string;
}
@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  category: string;

  @Prop({ type: Number, default: 0, min: 0, max: 5 }) // Rating between 0 and 5
  rating: number;

  @Prop({
    type: Object,
    default: { isActive: false, discountPercentage: 0 },
  })
  offer?: {
    isActive: boolean;
    discountPercentage: number;
  };
  @Prop({ type: String })
  imageUrl: string;
  _id: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
