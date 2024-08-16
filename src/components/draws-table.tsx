'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDraw, deleteDraw } from '@/db/actions';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown, PlusCircle, Trash } from 'lucide-react';
import { type z } from 'zod';

import { Draw } from '@/types/draw';
import { createDrawFormSchema } from '@/lib/zodSchemas';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import { AddDrawForm } from '@/components/add-draw-form';
import { OrderActionDialog } from '@/components/orders-action-dialog';

export const columns: ColumnDef<Draw>[] = [
  {
    accessorKey: 'id',
    header: 'Draw ID',
    enableHiding: true
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('date') ? new Date(row.getValue('date')) : null;
      return <div>{date ? format(date, 'MM/dd/yyyy') : '—'}</div>;
    }
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseInt(row.getValue('amount')) / 100;
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
      return <div className="font-medium text-right">{formatted}</div>;
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const drawId = row.getValue('id') as number;
      return (
        <div className="text-right">
          <form action={async () => await deleteDraw(drawId)}>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              type="submit"
            >
              <Trash className="h-3.5 w-3.5" />
              <span className="sr-only">Delete</span>
            </Button>
          </form>
        </div>
      );
    }
  }
];

export function DrawsTable({ data }: { data: Draw[] }) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false
  });

  //Todo add fetch for draws from expenses table

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility
    }
  });

  async function handleAddDraw(values: z.infer<typeof createDrawFormSchema>) {
    setIsSubmitting(true);
    try {
      const response = await createDraw(values);
      if (response.status === 'success') {
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
    <div className="h-full">
      <Card x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Draws</CardTitle>
            <CardDescription>Personal income withdrawls</CardDescription>
          </div>
          <Dialog onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 ml-auto gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Draw
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Manual Draw</DialogTitle>
                <DialogDescription>
                  This will add a draw record for personal income accounting.
                  This will not be reflected in your expenses.
                </DialogDescription>
              </DialogHeader>
              <AddDrawForm
                onCreateDraw={handleAddDraw}
                submitting={isSubmitting}
              />
              <DialogFooter>
                <Button
                  form="AddDrawForm"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
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
              {table.getFilteredRowModel().rows.length} draws
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
        </CardContent>
      </Card>
    </div>
  );
}
