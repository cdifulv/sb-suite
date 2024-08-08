import { getPendingOrders } from '@/db/queries';
import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { OrderActionDialog } from '@/components/orders-action-dialog';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function DashboardOrders() {
  const orders = await getPendingOrders();

  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-5">
      <CardHeader className="px-7">
        <CardTitle>Pending Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">
                Payment Status
              </TableHead>
              <TableHead className="hidden sm:table-cell">Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {order.customerEmail}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    className={
                      order.paymentStatus === 'paid'
                        ? 'text-xs bg-lime-200 text-lime-950 '
                        : 'text-xs bg-cyan-200 text-cyan-950 '
                    }
                    variant="outline"
                  >
                    {capitalizeFirstLetter(order.paymentStatus)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {order.dueDate
                    ? format(new Date(order.dueDate), 'MMM dd, yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  ${(order.total / 100).toFixed(2)}
                </TableCell>
                <TableCell className="w-10">
                  <OrderActionDialog
                    orderId={order.id}
                    orderDueDate={order.dueDate}
                    orderStatus={order.orderStatus}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
