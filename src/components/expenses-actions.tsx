'use client';

import { useEffect, useState } from 'react';
import { createExpense, importExpenses } from '@/db/actions';
import { type RowSelectionState } from '@tanstack/react-table';
import { File, PlusCircle } from 'lucide-react';
import { type z } from 'zod';

import { type ExpenseImport } from '@/types/expense';
import { type createExpenseFormSchema } from '@/lib/zodSchemas';
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
import { toast } from '@/components/ui/use-toast';

import { AddExpenseForm } from './add-expense-form';
import { ExpensesImport } from './expenses-import';
import { ExpensesImportTable } from './expenses-import-table';

export function ExpensesActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importData, setImportData] = useState<ExpenseImport[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    const initialSelectedRows = importData.reduce(
      (acc, row) => {
        if (row.id) acc[row.id] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
    setRowSelection(initialSelectedRows);
  }, [importData]);

  async function handleAddExpense(
    values: z.infer<typeof createExpenseFormSchema>
  ) {
    setIsSubmitting(true);
    try {
      const response = await createExpense(values);
      if (response.status === 'success') {
        setIsOpen(false);
        toast({
          title: 'Expense created successfully',
          description: 'An expense transaction has been created.'
        });
      }
      return response;
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'An error occurred while creating the expense.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function onImportWindowChange() {
    setIsImportOpen(!isImportOpen);
    if (!isImportOpen) {
      setImportData([]);
    }
  }

  async function handleImportExpenses(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedRows = Object.keys(rowSelection).filter(
        (key) => rowSelection[key]
      );
      const importedData = selectedRows.map(
        (rowId): ExpenseImport | undefined => {
          const row = importData.find(
            (row: ExpenseImport | undefined) => row?.id === rowId
          );
          return row;
        }
      );
      await importExpenses(
        importedData.map((row) => ({
          amount: (row?.amount ?? 0).toString(),
          description: row?.description ?? '',
          date:
            row?.date != null &&
            typeof row.date === 'object' &&
            'getTime' in row.date
              ? row.date
              : new Date(row?.date ?? Date.now())
        }))
      );
      setIsImportOpen(false);
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'An error occurred while importing the expenses.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center">
      <div className="ml-auto flex items-center gap-2">
        <Dialog onOpenChange={onImportWindowChange} open={isImportOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Import
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl md:max-w-screen-lg max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle />
              <DialogDescription />
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              {importData.length > 0 ? (
                <form id="ImportExpensesForm" onSubmit={handleImportExpenses}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Import Expenses</CardTitle>
                      <CardDescription>
                        Select expenses to import.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ExpensesImportTable
                        importData={importData}
                        selectedRows={rowSelection}
                        setSelectedRows={setRowSelection}
                      />
                    </CardContent>
                  </Card>
                </form>
              ) : (
                <ExpensesImport setImportData={setImportData} />
              )}
            </div>

            <DialogFooter className=" flex-shrink-0">
              <Button
                form="ImportExpensesForm"
                type="submit"
                disabled={
                  !importData ||
                  Object.keys(rowSelection).length === 0 ||
                  isSubmitting
                }
              >
                Import
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 ml-auto gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Expense
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
              <DialogDescription>
                This will create an expense line item.
              </DialogDescription>
            </DialogHeader>
            <AddExpenseForm
              onCreateExpense={handleAddExpense}
              submitting={isSubmitting}
            />
            <DialogFooter>
              <Button
                form="AddExpenseForm"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
