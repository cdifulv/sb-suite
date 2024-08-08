import { orders } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { type z } from 'zod';

import {
  createOrderFormSchema,
  type updateOrderSchema
} from '@/lib/zodSchemas';

export type Order = InferSelectModel<typeof orders>;

export type UpdateOrder = z.infer<typeof updateOrderSchema>;

export type UpdateOrderResponse = {
  status: 'success' | 'error';
  message: string;
  errors?: Record<string, string>;
};

export type CreateOrder = z.infer<typeof createOrderFormSchema>;
