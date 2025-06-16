import { IsNumber, IsPositive } from 'class-validator';

export class AddItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}