import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-pro.dto';
import { UpdateProductDto } from './dto/update-pro.dto';
import { AuthGuard } from '@nestjs/passport';
import { Product } from './schema/product.schema';
import { User } from 'src/users/schemas/user.schema';

@Controller('products')
export class ProductsController {
  constructor(private productsservice: ProductsService) {}
  @Post()
  createProduct(
    @Body() CreateProductDto: CreateProductDto,
    @Request() req,
  ): Promise<Product> {
    const user: User = req.user;
    return this.productsservice.createProduct(CreateProductDto, user);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProducts() {
    return this.productsservice.getProducts();
  }
  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsservice.getProductById(id);
  }
  @Put(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() UpdateProductDto: UpdateProductDto,
  ) {
    return this.productsservice.updateProduct(id, UpdateProductDto);
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsservice.deleteProduct(id);
  }
}
