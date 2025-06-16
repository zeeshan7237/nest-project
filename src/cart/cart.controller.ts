import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Req,
  Param,
  Body,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { AddItemDto } from './dto/cart.dto';
import { User } from '@prisma/client';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: RequestWithUser) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  async addItem(
    @Req() req: RequestWithUser,
    @Body() addItemDto: AddItemDto,
  ) {
    return this.cartService.addItem(
      req.user.id,
      addItemDto.productId,
      addItemDto.quantity,
    );
  }

  @Put('items/:productId')
  async updateItem(
    @Req() req: RequestWithUser,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItem(req.user.id, +productId, quantity);
  }

  @Delete('items/:productId')
  async removeItem(
    @Req() req: RequestWithUser,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(req.user.id, +productId);
  }
}