import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// export type ProductDocument = Product & Document;

// Define the Product interface that extends Document
export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
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

  _id: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
