import { IsString } from 'class-validator';

export class addItemDto {
  @IsString()
  userId: string;
  @IsString()
  productId: string;
  @IsString()
  quantity: number;
}
