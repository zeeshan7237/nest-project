import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async addItem(userId: number, productId: number, quantity: number = 1) {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      create: {
        user: { connect: { id: userId } },
        items: {
          create: {
            productId,
            quantity,
          },
        },
      },
      update: {},
      include: { items: true },
    });

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  }

  async updateItem(userId: number, productId: number, quantity: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find((i) => i.productId === productId);

    if (!item) {
      throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    return this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find((i) => i.productId === productId);

    if (!item) {
      throw new Error('Item not found in cart');
    }

    return this.prisma.cartItem.delete({
      where: { id: item.id },
    });
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  async calculateTotal(userId: number) {
    const cart = await this.getCart(userId);
    if (!cart) return 0;

    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }
}