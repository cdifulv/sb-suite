import { Suspense } from 'react';
import { getExpenses } from '@/db/queries';

import { ExpensesActions } from '@/components/expenses-actions';
import { ExpensesTable } from '@/components/expenses-table';

export default async function ExpensesPage() {
  const initialData = await getExpenses();
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col px-4 py-2">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Expenses
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage and track business spending
          </p>
        </div>
        <ExpensesActions />
      </div>

      <Suspense fallback={<div>Loading</div>}>
        <ExpensesTable data={initialData} />
      </Suspense>
    </main>
  );
}
