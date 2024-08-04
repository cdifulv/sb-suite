import 'server-only';

import { db } from '@/db';

export async function getOrder(orderId: number) {
  const order = await db.query.orders.findFirst({
    where: (model, { eq }) => eq(model.id, orderId)
  });
  return order;
}

export async function getPendingOrders() {
  const pendingOrders = await db.query.orders.findMany({
    where: (model, { eq }) => eq(model.orderStatus, 'pending'),
    orderBy: (model, { asc }) => asc(model.dueDate)
  });

  return pendingOrders;
}

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
