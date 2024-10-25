import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-pro.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsservice: ProductsService) {}
  @Post()
  createProduct(@Body() CreateProductDto: CreateProductDto) {
    return this.productsservice.createProduct(CreateProductDto);
  }
}
