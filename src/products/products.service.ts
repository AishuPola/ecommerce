import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-pro.dto';
import { UpdateProductDto } from './dto/update-pro.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
  ) {}

  createProduct(
    CreateProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const product = new this.ProductModel({ ...CreateProductDto, user }).save();
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
  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.ProductModel.find({
      category: { $regex: new RegExp(`^${category}$`, 'i') },
    }).exec();
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
  async findProductsByIds(productIds: string[]): Promise<Product[]> {
    if (!productIds.length) return []; // Handle empty array
    return this.ProductModel.find({ _id: { $in: productIds } }).exec();
  }

  async updateProductStock(
    productId: string,
    quantityChange: number,
  ): Promise<Product> {
    const product = await this.ProductModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Ensure stock does not go negative
    if (product.stock + quantityChange < 0) {
      throw new BadRequestException(
        `Not enough stock for product ${product.name}`,
      );
    }

    // Update the stock
    product.stock += quantityChange;
    await product.save();

    return product;
  }

  async getDiscountedPrice(id: string, quantity: number): Promise<number> {
    const product = await this.ProductModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let discountedPrice = product.price;

    // Check if there's an active offer
    if (product.offer?.isActive && product.offer.discountPercentage > 0) {
      discountedPrice =
        product.price * (1 - product.offer.discountPercentage / 100);
    }

    return discountedPrice * quantity;
  }
}
