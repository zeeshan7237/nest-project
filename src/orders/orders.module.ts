import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, CartService],
})
export class OrdersModule {}