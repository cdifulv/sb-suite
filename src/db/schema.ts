import {
  boolean,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name').notNull(),
  customerEmail: varchar('customer_email'),
  description: text('description'),
  dueDate: timestamp('due_date'),
  orderStatus: varchar('order_status').notNull(),
  salesTax: integer('sales_tax').notNull(),
  salesTaxRate: decimal('sales_tax_rate').notNull(),
  total: integer('total').notNull(),
  totalExcludingTax: integer('total_excluding_tax').notNull(),
  paymentStatus: varchar('payment_status').notNull(),
  paymentMethod: varchar('payment_method'),
  paymentDate: timestamp('payment_date'),
  stripeInvoiceId: varchar('stripe_invoice_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const draws = pgTable('draws', {
  id: serial('id').primaryKey(),
  amount: integer('amount').notNull(),
  date: timestamp('date').notNull(),
  deleted: boolean('deleted').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  amount: integer('amount').notNull(),
  date: timestamp('date').notNull(),
  description: text('description').notNull(),
  receipt: varchar('receipt'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});
