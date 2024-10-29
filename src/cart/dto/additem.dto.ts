import { IsNumber, IsString } from 'class-validator';

export class addItemDto {
  @IsNumber()
  quantity: number;
}
