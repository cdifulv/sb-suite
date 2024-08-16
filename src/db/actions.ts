'use server';

import 'server-only';

import { revalidateTag } from 'next/cache';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

import { CreateDraw } from '@/types/draw';
import { type CreateOrder, type UpdateOrder } from '@/types/order';
import {
  createDrawFormSchema,
  createOrderFormSchema,
  updateOrderSchema
} from '@/lib/zodSchemas';

import { getOrder } from './queries';
import { draws, orders } from './schema';

export type UpdateOrderResponse = {
  status: 'success' | 'error';
  message: string;
  errors?: Record<string, string>;
};
export async function updateOrder(orderId: number, rawData: UpdateOrder) {
  const order = await getOrder(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  const parsed = updateOrderSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Invalid form data',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const data = parsed.data;
  const values = {
    dueDate: data.dueDate ?? order.dueDate,
    orderStatus: data.status ?? order.orderStatus
  };

  if (data.status === 'complete' && !order.dueDate && !data.dueDate) {
    values.dueDate = new Date();
  }

  try {
    await db
      .update(orders)
      .set({ ...values })
      .where(eq(orders.id, orderId));

    revalidateTag('orders');
    revalidateTag('pendingOrders');
  } catch (e) {
    console.error(e);
    throw new Error('Failed to update order');
  }

  return {
    status: 'success',
    message: 'Order updated successfully'
  };
}

export type CreateOrderResponse = {
  status: 'success' | 'error';
  message: string;
  errors?: Record<string, string[]>;
};
export async function createOrder(
  rawData: CreateOrder
): Promise<CreateOrderResponse> {
  const parsed = createOrderFormSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Invalid form data',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const data = parsed.data;
  const salesTax = data.total * Number(data.salesTaxRate);
  const formattedData = {
    customerName: data.customerName,
    customerEmail:
      !data.customerEmail || data.customerEmail === ''
        ? null
        : data.customerEmail,
    description:
      !data.description || data.description === '' ? null : data.description,
    salesTaxRate: data.salesTaxRate,
    salesTax: salesTax,
    total: data.total,
    totalExcludingTax: data.total - salesTax,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    orderStatus: 'pending',
    paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
    paymentStatus:
      !data.paymentStatus || data.paymentStatus === ''
        ? 'open'
        : data.paymentStatus
  };

  try {
    await db.insert(orders).values(formattedData);
    revalidateTag('orders');
    revalidateTag('pendingOrders');
  } catch (e) {
    console.error(e);
    throw new Error('Failed to create order');
  }

  return {
    status: 'success',
    message: 'Order created successfully'
  };
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

export type CreateDrawResponse = {
  status: 'success' | 'error';
  message: string;
  errors?: Record<string, string[]>;
};
export async function createDraw(
  rawData: CreateDraw
): Promise<CreateDrawResponse> {
  const parsed = createDrawFormSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Invalid form data',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const values = {
    amount: parseFloat(parsed.data.amount) * 100,
    date: new Date(parsed.data.date)
  };

  try {
    await db.insert(draws).values(values);
    revalidateTag('draws');
  } catch (e) {
    console.error(e);
    throw new Error('Failed to create draw');
  }

  return {
    status: 'success',
    message: 'Draw created successfully'
  };
}

export async function deleteDraw(drawId: number) {
  const draw = await db.query.draws.findFirst({
    where: (model, { eq }) => eq(model.id, drawId)
  });

  if (!draw) {
    throw new Error('Draw not found');
  }

  await db.update(draws).set({ deleted: true }).where(eq(draws.id, drawId));
  revalidateTag('draws');
}
