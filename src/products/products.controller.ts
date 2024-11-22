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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('products')
export class ProductsController {
  constructor(private productsservice: ProductsService) {}
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  createProduct(
    @Body() CreateProductDto: CreateProductDto,
    @Request() req,
  ): Promise<Product> {
    const user: User = req.user;
    return this.productsservice.createProduct(CreateProductDto, user);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get()
  getProducts() {
    return this.productsservice.getProducts();
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get('category/:categoryName')
  async getProductsByCategory(
    @Param('categoryName') categoryName: string,
  ): Promise<Product[]> {
    return this.productsservice.getProductsByCategory(categoryName);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsservice.getProductById(id);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() UpdateProductDto: UpdateProductDto,
  ) {
    return this.productsservice.updateProduct(id, UpdateProductDto);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsservice.deleteProduct(id);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get(':id/discounted-price')
  async getDiscountedPrice(
    @Param('id') id: string,
    quantity: number,
  ): Promise<{ discountedPrice: number }> {
    const discountedPrice = await this.productsservice.getDiscountedPrice(
      id,
      quantity,
    );
    return { discountedPrice };
  }
}
