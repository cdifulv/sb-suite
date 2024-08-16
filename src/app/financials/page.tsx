import { Suspense } from 'react';
import { getDraws, getOrders } from '@/db/queries';

import { DrawsTable } from '@/components/draws-table';
import { FinanceCards } from '@/components/finance-cards';

export default async function FinancialsPage() {
  const orders = await getOrders();
  const draws = await getDraws();
  return (
    <main className="flex flex-1 flex-col p-4 md:p-8">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 ">
        <Suspense fallback={<div>Loading</div>}>
          <FinanceCards orders={orders} />
        </Suspense>

        <Suspense fallback={<div>Loading</div>}>
          <DrawsTable data={draws} />
        </Suspense>
      </div>
    </main>
  );
}
