import {
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
  total: integer('total').notNull(),
  paymentStatus: varchar('payment_status').notNull(),
  paymentMethod: varchar('payment_method'),
  paymentDate: timestamp('payment_date'),
  stripeInvoiceId: varchar('stripe_invoice_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});
