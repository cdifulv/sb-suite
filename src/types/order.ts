import { type orders } from '@/db/schema';
import { type InferSelectModel } from 'drizzle-orm';
import { type z } from 'zod';

import {
  type createOrderFormSchema,
  type updateOrderSchema
} from '@/lib/zodSchemas';

export type Order = InferSelectModel<typeof orders>;

export type UpdateOrder = z.infer<typeof updateOrderSchema>;

export type CreateOrder = z.infer<typeof createOrderFormSchema>;
