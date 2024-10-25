import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-pro.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
  ) {}
  createProduct(CreateProductDto: CreateProductDto): Promise<Product> {
    const product = new this.ProductModel(CreateProductDto).save();
    console.log(product);
    return product;
  }
}
