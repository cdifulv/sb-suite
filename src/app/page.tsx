import { Suspense } from 'react';

import { DashboardCards } from '@/components/dashboard-cards';
import { DashboardOrders } from '@/components/dashboard-orders';
import { DashboardTransactions } from '@/components/dashboard-transactions';

export default function IndexPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Suspense fallback={<div>Loading</div>}>
        <DashboardCards />
      </Suspense>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Suspense fallback={<div>Loading</div>}>
          <DashboardOrders />
        </Suspense>
        <Suspense fallback={<div>Loading</div>}>
          <DashboardTransactions />
        </Suspense>
      </div>
    </main>
  );
}
