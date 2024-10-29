import { Body, Controller, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { addItemDto } from './dto/additem.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post('add')
  async addProductToCart(@Body() addItemDto: addItemDto) {
    return this.cartService.addProductToCart(addItemDto);
  }
}
