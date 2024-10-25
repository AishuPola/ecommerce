import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-pro.dto';
import { UpdateProductDto } from './dto/update-pro.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsservice: ProductsService) {}
  @Post()
  createProduct(@Body() CreateProductDto: CreateProductDto) {
    return this.productsservice.createProduct(CreateProductDto);
  }
  @Get()
  getProducts() {
    return this.productsservice.getProducts();
  }
  @Put(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() UpdateProductDto: UpdateProductDto,
  ) {
    return this.productsservice.updateProduct(id, UpdateProductDto);
  }
}
