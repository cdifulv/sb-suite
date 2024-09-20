import { getDraws, getMonthlyFinancials, getOrders } from '@/db/queries';
import { format, startOfMonth } from 'date-fns';

import { DrawsTable } from '@/components/draws-table';
import { FinanceCards } from '@/components/finance-cards';

export default async function FinancialsPage() {
  const currentMonth = startOfMonth(new Date());
  const orders = await getOrders();
  const draws = await getDraws();
  const financeData = await getMonthlyFinancials(currentMonth);

  const uniqueMonths = orders
    .filter((order) => order.paymentDate)
    .reduce((acc: { value: Date; label: string }[], order) => {
      if (order.dueDate) {
        const dueDate = new Date(order.dueDate);
        const value = startOfMonth(dueDate);
        const label = format(value, 'MMM yyyy');
        const key = value.toISOString();

        if (!acc.some((item) => item.value.toISOString() === key)) {
          acc.push({ value, label });
        }
      }
      return acc;
    }, [])
    .sort((a, b) => b.value.getTime() - a.value.getTime());

  return (
    <main className="flex flex-1 flex-col p-4 md:p-8">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 ">
        <FinanceCards
          financeData={financeData}
          currentMonth={currentMonth}
          uniqueMonths={uniqueMonths}
        />

        <DrawsTable data={draws} />
      </div>
    </main>
  );
}
