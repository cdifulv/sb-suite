import { type z } from 'zod';

import { type updateOrderSchema } from '@/lib/zodSchemas';

export type UpdateOrder = z.infer<typeof updateOrderSchema>;

export type UpdateOrderResponse = {
  status: 'success' | 'error';
  message: string;
  errors?: Record<string, string>;
};
