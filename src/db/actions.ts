'use server';

import 'server-only';

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

import { type UpdateOrder } from '@/types/order';

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

  revalidatePath('/');
}
