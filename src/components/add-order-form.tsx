'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { UpdateOrderResponse } from '@/types/order';
import { cn } from '@/lib/utils';
import { createOrderFormSchema } from '@/lib/zodSchemas';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AddOrderFormProps {
  onCreateOrder: (
    values: z.infer<typeof createOrderFormSchema>
  ) => Promise<UpdateOrderResponse | undefined>;
  submitting: boolean;
  initialValues?: z.infer<typeof createOrderFormSchema>;
}

export function AddOrderForm({
  onCreateOrder,
  submitting,
  initialValues
}: AddOrderFormProps) {
  const form = useForm<z.infer<typeof createOrderFormSchema>>({
    resolver: zodResolver(createOrderFormSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      description: '',
      total: '',
      dueDate: undefined,
      paymentDate: undefined,
      paymentStatus: '',
      ...initialValues
    }
  });

  async function onSubmit(values: z.infer<typeof createOrderFormSchema>) {
    const response = await onCreateOrder(values);
    if (response && response.errors) {
      const errors = response.errors;
      Object.keys(response.errors).forEach((key) => {
        form.setError(key as keyof typeof form.formState.errors, {
          type: 'manual',
          message: errors[key]
        });
      });
    }
  }

  return (
    <Form {...form}>
      <form
        id="AddOrderForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={submitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={submitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={submitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total</FormLabel>
              <FormControl>
                <CurrencyInput
                  onBlur={field.onBlur}
                  id="total"
                  name="total"
                  className={
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  }
                  value={field.value}
                  defaultValue={''}
                  prefix="$"
                  decimalsLimit={2}
                  disabled={submitting}
                  onValueChange={(value, name, values) => {
                    const total = value ?? '';
                    field.onChange(total);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mt-1">Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={submitting}
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
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={submitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mt-1">Payment Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={submitting}
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
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
