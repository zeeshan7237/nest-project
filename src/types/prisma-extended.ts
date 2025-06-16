import { User, Product, Cart, Order } from '@prisma/client';

export type UserWithCart = User & { cart?: Cart };
export type ProductWithRelations = Product;
export type CartWithItems = Cart & {
  items: Array<{
    product: Product;
    quantity: number;
  }>;
};
export type OrderWithItems = Order & {
  items: Array<{
    product: Product;
    quantity: number;
    price: number;
  }>;
};