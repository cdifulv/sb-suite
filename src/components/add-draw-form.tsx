'use client';

import { CreateDrawResponse } from '@/db/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

import { cn } from '@/lib/utils';
import { createDrawFormSchema } from '@/lib/zodSchemas';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface AddOrderFormProps {
  onCreateDraw: (
    values: z.infer<typeof createDrawFormSchema>
  ) => Promise<CreateDrawResponse | undefined>;
  submitting: boolean;
  initialValues?: z.infer<typeof createDrawFormSchema>;
}

export function AddDrawForm({
  onCreateDraw,
  submitting,
  initialValues
}: AddOrderFormProps) {
  const form = useForm<z.infer<typeof createDrawFormSchema>>({
    resolver: zodResolver(createDrawFormSchema),
    defaultValues: {
      amount: '',
      date: undefined,
      ...initialValues
    }
  });

  async function onSubmit(values: z.infer<typeof createDrawFormSchema>) {
    const response = await onCreateDraw(values);
    if (response?.errors) {
      Object.keys(response.errors).forEach((key) => {
        form.setError(key as keyof typeof form.formState.errors, {
          type: 'manual',
          message: Array.isArray(response.errors?.[key])
            ? response.errors?.[key][0]
            : (response.errors?.[key] ?? 'A validation error occurred.')
        });
      });
    }
  }

  return (
    <Form {...form}>
      <form
        id="AddDrawForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="amount"
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
                  onValueChange={(value, _name, _values) => {
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mt-1">Date</FormLabel>
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
