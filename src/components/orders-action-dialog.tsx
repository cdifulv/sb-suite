'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrder } from '@/db/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, MoreVertical } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

import { type UpdateOrderResponse } from '@/types/order';
import { cn } from '@/lib/utils';
import { dueDateFormSchema } from '@/lib/zodSchemas';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';

interface OrderActionDialogProps {
  orderId: number;
  orderDueDate?: Date | null;
}

export function OrderActionDialog({
  orderId,
  orderDueDate
}: OrderActionDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof dueDateFormSchema>>({
    resolver: zodResolver(dueDateFormSchema),
    defaultValues: {
      dueDate: orderDueDate ?? undefined
    }
  });
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit() {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dueDate: form.getValues('dueDate')
        })
      });

      router.refresh();

      const response = (await res.json()) as UpdateOrderResponse;

      if (!res.ok) {
        form.setError('dueDate', {
          type: 'manual',
          message: response.errors?.dueDate ?? 'A validation error occurred.'
        });
        return;
      }

      onOpenChangeHandler(false);

      toast({
        title: 'Due date has been updated',
        description: 'The due date has been updated.'
      });
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'An error occurred while updating the due date.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function onOpenChangeHandler(open: boolean) {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  }

  return (
    <Dialog onOpenChange={onOpenChangeHandler} open={isOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" className="h-8 w-8">
            <MoreVertical className="h-3.5 w-3.5" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setIsOpen(true)}>
              Set Due Date
            </DropdownMenuItem>
          </DialogTrigger>
          <form
            action={async () => {
              await updateOrder(orderId, { status: 'complete' });
            }}
          >
            <button type="submit" className="block w-full">
              <DropdownMenuItem className="w-full">Complete</DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Due Date</DialogTitle>
          <DialogDescription>
            Set a new due date for this order.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            ref={formRef}
            id="dueDateForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isSubmitting}
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button form="dueDateForm" type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
