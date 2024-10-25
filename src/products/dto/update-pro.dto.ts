import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-pro.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
