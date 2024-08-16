/* eslint-disable drizzle/enforce-delete-with-where */
import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import Stripe from 'stripe';

import { orders } from './schema';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const sql = postgres(process.env.POSTGRES_URL!, { max: 1 });

const db = drizzle(sql);

const main = async () => {
  try {
    console.log('Seeding database');
    await db.delete(orders);

    const stripe = new Stripe(process.env.STRIPE_SECRET!);
    const invoices = await stripe.invoices.list({
      limit: 100
    });
    const validInvoices = invoices.data.filter(
      (invoice) => invoice.status !== 'draft' && invoice.status !== 'void'
    );

    const charges = await stripe.charges.list({
      limit: 100
    });
    const validCharges = charges.data
      .filter((charge) => charge.status === 'succeeded')
      .sort((a, b) => b.created - a.created);

    type Order = typeof orders.$inferInsert;

    const ordersData: Order[] = [];
    for (const invoice of validInvoices) {
      const charge = validCharges.find(
        (charge) => charge.invoice === invoice.id
      );
      const containsCookie = invoice.lines.data.some(
        (line) => line.description?.match(/cookie/i) !== null
      );
      ordersData.push({
        customerName: invoice.customer_name!,
        customerEmail: invoice.customer_email!,
        description: invoice.description,
        dueDate: invoice.paid ? new Date(invoice.due_date! * 1000) : null,
        orderStatus:
          new Date(invoice.due_date! * 1000) < new Date()
            ? 'complete'
            : 'pending',
        salesTax: invoice.tax ?? 0,
        salesTaxRate: containsCookie
          ? '7.35'
          : invoice.default_tax_rates.length > 0 &&
              invoice.default_tax_rates[0].effective_percentage
            ? invoice.default_tax_rates[0].effective_percentage.toFixed(2)
            : '6.35',
        total: invoice.total,
        totalExcludingTax: invoice.total_excluding_tax ?? 0,
        paymentStatus: invoice.status!,
        paymentMethod:
          invoice.status === 'paid' && invoice.amount_remaining === 0
            ? 'stripe'
            : invoice.status === 'paid' && invoice.amount_due > 0
              ? 'cash'
              : null,
        paymentDate: charge
          ? new Date(charge.created * 1000)
          : invoice.status === 'paid' && invoice.amount_due > 0
            ? new Date(invoice.due_date! * 1000)
            : null,
        stripeInvoiceId: invoice.id
      });
    }

    await db.insert(orders).values(ordersData);

    console.log('Seeding successful');
  } catch (error) {
    console.error('Seeding failed', error);
    process.exit(1);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
