'use server';

import 'server-only';

import { revalidateTag } from 'next/cache';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

import { CreateOrder, type UpdateOrder } from '@/types/order';

import { getOrder } from './queries';
import { orders } from './schema';

export async function updateOrder(orderId: number, data: UpdateOrder) {
  const order = await getOrder(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  const values = {
    dueDate: data.dueDate ?? order.dueDate,
    orderStatus: data.status ?? order.orderStatus
  };

  if (data.status === 'complete' && !order.dueDate && !data.dueDate) {
    values.dueDate = new Date();
  }

  await db
    .update(orders)
    .set({ ...values })
    .where(eq(orders.id, orderId));

  revalidateTag('orders');
  revalidateTag('pendingOrders');
}

export async function createOrder(data: CreateOrder) {
  const formattedData = {
    customerName: data.customerName,
    customerEmail:
      !data.customerEmail || data.customerEmail === ''
        ? null
        : data.customerEmail,
    description:
      !data.description || data.description === '' ? null : data.description,
    total: parseFloat(data.total as string) * 100,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    orderStatus: 'pending',
    paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
    paymentStatus:
      !data.paymentStatus || data.paymentStatus === ''
        ? 'open'
        : data.paymentStatus
  };
  await db.insert(orders).values(formattedData);

  // revalidateTag('orders');
  // revalidateTag('pendingOrders');
}

export async function deleteOrder(orderId: number) {
  const order = await getOrder(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  if (order.stripeInvoiceId) {
    throw new Error('Cannot delete an order with a Stripe invoice');
  }

  await db.delete(orders).where(eq(orders.id, orderId));

  revalidateTag('orders');
  revalidateTag('pendingOrders');
}
