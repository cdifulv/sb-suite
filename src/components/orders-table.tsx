'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/db/actions';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { type z } from 'zod';

import { type Order } from '@/types/order';
import { type createOrderFormSchema } from '@/lib/zodSchemas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';

import { AddOrderForm } from './add-order-form';
import { OrderActionDialog } from './orders-action-dialog';

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Order ID',
    enableHiding: true
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'customerEmail',
    header: 'Customer Email',
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('customerEmail')}</div>
    )
  },
  {
    accessorKey: 'orderStatus',
    header: 'Order Status',
    cell: ({ row }) => {
      const orderStatus = row.getValue('orderStatus') as string;
      return (
        <Badge
          className={
            orderStatus === 'pending'
              ? 'capitalize text-xs bg-amber-200 text-amber-950 '
              : 'capitalize text-xs bg-violet-600 text-violet-50 '
          }
          variant="outline"
        >
          {orderStatus}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('dueDate')
        ? new Date(row.getValue('dueDate'))
        : null;
      return <div>{date ? format(date, 'MM/dd/yyyy') : '—'}</div>;
    }
  },
  {
    accessorKey: 'total',
    header: 'Total Due',
    cell: ({ row }) => {
      const amount = parseInt(row.getValue('total')) / 100;
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    }
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => {
      const paymentStatus = row.getValue('paymentStatus') as string;
      return (
        <Badge
          className={
            paymentStatus === 'paid'
              ? 'capitalize text-xs bg-lime-200 text-lime-950 '
              : 'capitalize text-xs bg-cyan-200 text-cyan-950 '
          }
          variant="outline"
        >
          {paymentStatus}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Payment Method',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('paymentMethod')}</div>
    )
  },
  {
    accessorKey: 'paymentDate',
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Payment Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('paymentDate')
        ? new Date(row.getValue('paymentDate'))
        : null;
      return <div>{date ? format(date, 'MM/dd/yyyy') : '—'}</div>;
    }
  },
  {
    accessorKey: 'stripeInvoiceId',
    header: 'Stripe Invoice ID',
    enableHiding: true
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const orderId = row.getValue('id') as number;
      const dueDate = row.getValue('dueDate') as Date;
      const orderStatus = row.getValue('orderStatus') as string;
      const stripeInvoiceId = row.getValue('stripeInvoiceId') as string;

      return (
        <div className="text-right">
          <OrderActionDialog
            orderId={orderId}
            orderDueDate={dueDate}
            orderStatus={orderStatus}
            stripeInvoiceId={stripeInvoiceId}
          />
        </div>
      );
    }
  }
];

export function OrdersTable({ data }: { data: Order[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    stripeInvoiceId: false
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility
    }
  });

  async function handleAddOrder(values: z.infer<typeof createOrderFormSchema>) {
    setIsSubmitting(true);

    try {
      const response = await createOrder(values);
      if (response.status === 'success') {
        router.refresh();
        setIsOpen(false);
        toast({
          title: 'Order created successfully',
          description: 'A manual order has been created.'
        });
      }
      return response;
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'An error occurred while creating the order.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter customers..."
          value={
            (table.getColumn('customerName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('customerName')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex ml-auto pl-2">
          <Dialog onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
            <DialogTrigger asChild>
              <Button className="mr-4">Add Order</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Manual Order</DialogTitle>
                <DialogDescription>
                  This action should only be performed for orders that cannot be
                  invoiced through Stripe.
                </DialogDescription>
              </DialogHeader>
              <AddOrderForm
                onCreateOrder={handleAddOrder}
                submitting={isSubmitting}
              />
              <DialogFooter>
                <Button
                  form="AddOrderForm"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} orders
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
