// create-order.dto.ts
import { IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  totalAmount: number;
}
