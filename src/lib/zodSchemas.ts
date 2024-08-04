import { z } from 'zod';

export const dueDateFormSchema = z.object({
  dueDate: z.date({
    required_error: 'A due date is required.'
  })
});

export const updateOrderSchema = z.object({
  dueDate: z
    .string({
      required_error: 'A due date is required.'
    })
    .refine(
      (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
      },
      {
        message: 'Invalid date format.'
      }
    )
    .transform((dateString) => new Date(dateString))
    .optional(),
  status: z.enum(['pending', 'complete']).optional()
});
