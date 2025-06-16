import { Controller, Get, Post, UseGuards, Req, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '@prisma/client';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req: RequestWithUser) {
    return this.ordersService.create(req.user.id);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.ordersService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.ordersService.findOne(+id, req.user.id);
  }
}