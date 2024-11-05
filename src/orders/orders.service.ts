import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CartService } from 'src/cart/cart.service';
import { Model } from 'mongoose';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class OrdersService {
  constructor() {}
}
