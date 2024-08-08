import 'server-only';

import { unstable_cache } from 'next/cache';
import { db } from '@/db';

export async function getOrder(orderId: number) {
  const order = await db.query.orders.findFirst({
    where: (model, { eq }) => eq(model.id, orderId)
  });
  return order;
}

export const getOrders = unstable_cache(
  async function getOrders() {
    return await db.query.orders.findMany();
  },
  ['orders'],
  {
    tags: ['orders']
  }
);

export const getPendingOrders = unstable_cache(
  async function getPendingOrders() {
    return await db.query.orders.findMany({
      where: (model, { eq }) => eq(model.orderStatus, 'pending'),
      orderBy: (model, { asc }) => asc(model.dueDate)
    });
  },
  ['pendingOrders'],
  {
    tags: ['pendingOrders']
  }
);

export async function getOrderPaymentsBetweenDates(
  startDate: Date,
  endDate: Date
) {
  const orders = await db.query.orders.findMany({
    where: (model, { and, gte, lte }) =>
      and(gte(model.paymentDate, startDate), lte(model.paymentDate, endDate))
  });

  return orders;
}
