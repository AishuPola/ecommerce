import { IsNumber, IsString } from 'class-validator';

export class addItemDto {
  @IsString()
  userId: string;
  @IsString()
  productId: string;
  @IsNumber()
  quantity: number;
}
