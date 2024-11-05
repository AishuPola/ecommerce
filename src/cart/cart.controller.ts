import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { addItemDto } from './dto/additem.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('add/:productId')
  async addToCart(
    @Request() req, // The request object contains user info if you're using authentication
    @Param('productId') productId: string,
    @Body() addItemDto: addItemDto, // Use DTO to validate request body
  ) {
    console.log('😍', req.user);
    const { quantity } = addItemDto; // Destructure quantity from the DTO
    return this.cartService.addItemToCart(
      req.user._doc._id,
      productId,
      quantity,
    ); // Use user ID from the request
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('items')
  async getCartItems(@Request() req) {
    const userId = req.user._doc._id;
    return this.cartService.getItemsInCart(userId);
  }
  // @UseGuards(AuthGuard('jwt'))
  // @Delete('clear')
  // async clearCartItems(@Request() req) {
  //   const userId = req.user._doc._id;
  //   return this.cartService.clearCartItems(userId);
  // }
}
