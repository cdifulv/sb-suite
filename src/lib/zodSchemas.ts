import { z } from 'zod';

export const dueDateFormSchema = z.object({
  dueDate: z.date({
    required_error: 'A due date is required.'
  })
});

export const updateOrderSchema = z.object({
  dueDate: z.coerce.date().optional(),
  status: z.enum(['pending', 'complete']).optional()
});

export const createOrderFormSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.'),
  customerEmail: z.string().email('Invalid email format.').optional(),
  description: z.string().optional(),
  salesTaxRate: z.string().min(0, 'Sales tax rate must be greater than 0.'),
  total: z
    .string()
    .min(1, 'Total is required.')
    .transform((value) => parseFloat(value) * 100),
  dueDate: z.coerce.date().optional(),
  paymentDate: z.coerce.date().optional(),
  paymentStatus: z.string().optional()
});

export const createDrawFormSchema = z.object({
  amount: z.string().min(1, 'Total is required.'),
  date: z.coerce.date()
});

export const createExpenseFormSchema = z.object({
  amount: z.string().min(1, 'Total is required.'),
  description: z.string(),
  date: z.coerce.date()
});
