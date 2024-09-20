import { type expenses } from '@/db/schema';
import { type InferSelectModel } from 'drizzle-orm';
import { type z } from 'zod';

import { type createExpenseFormSchema } from '@/lib/zodSchemas';

export type ExpenseImport = {
  id: string | undefined;
  date: string;
  amount: number;
  description: string;
};

export type ExpenseImportData = {
  Date: string;
  Amount: string;
  Description: string;
};

export type Expense = InferSelectModel<typeof expenses>;

export type CreateExpense = z.infer<typeof createExpenseFormSchema>;
