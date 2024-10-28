import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-pro.dto';
import { UpdateProductDto } from './dto/update-pro.dto';

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
  getProductById(id: string): Promise<Product> {
    const getProductById = this.ProductModel.findById(id).exec();
    return getProductById;
  }
  getProducts(): Promise<Product[]> {
    return this.ProductModel.find().exec();
  }
  async updateProduct(
    id: string,
    UpdateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.ProductModel.findOneAndUpdate(
      {
        _id: id,
      },
      UpdateProductDto,
      { new: true },
    ).exec();
    if (!updatedProduct) {
      throw new NotFoundException('product not found');
    }
    return updatedProduct;
  }
  async deleteProduct(id: string): Promise<Product> {
    const deleteProduct = await this.ProductModel.findByIdAndDelete(id).exec();

    if (!deleteProduct) {
      throw new NotFoundException('the product  not found');
    }
    // console.log(deleteProduct);
    return deleteProduct;
  }
}
