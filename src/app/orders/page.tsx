import { Suspense } from 'react';
import { getOrders } from '@/db/queries';

import { OrdersTable } from '@/components/orders-table';

export default async function OrdersPage() {
  const initialData = await getOrders();
  return (
    <main className="flex flex-1 flex-col p-4 md:p-5">
      <Suspense fallback={<div>Loading</div>}>
        <OrdersTable data={initialData} />
      </Suspense>
    </main>
  );
}
