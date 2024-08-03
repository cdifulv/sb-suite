import { Suspense } from 'react';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { sql } from 'drizzle-orm';
import Stripe from 'stripe';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

import { SkeletonCard } from './skeleton-card';

const now = new Date();

const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

const startOfPreviousMonth = new Date(startOfCurrentMonth);
startOfPreviousMonth.setMonth(startOfPreviousMonth.getMonth() - 1);

const endOfPreviousMonth = new Date(startOfPreviousMonth);
endOfPreviousMonth.setMonth(endOfPreviousMonth.getMonth() + 1);
endOfPreviousMonth.setDate(0);

const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
const endOfCurrentMonth = new Date(startOfNextMonth);
endOfCurrentMonth.setDate(endOfCurrentMonth.getDate() - 1);

async function getGrossRevenue() {
  try {
    const currOrders = await db
      .select()
      .from(orders)
      .where(
        sql`${orders.paymentStatus} = 'paid' AND ${orders.paymentDate} >= ${startOfCurrentMonth.toISOString()} AND ${orders.paymentDate} <= ${endOfCurrentMonth.toISOString()}`
      );

    const prevOrders = await db
      .select()
      .from(orders)
      .where(
        sql`${orders.paymentStatus} = 'paid' AND ${orders.paymentDate} >= ${startOfPreviousMonth.toISOString()} AND ${orders.paymentDate} <= ${endOfPreviousMonth.toISOString()}`
      );

    const totalRevenue = currOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const prevTotalRevenue = prevOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const percentageChange =
      ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100;

    return {
      grossRevenue: totalRevenue / 100,
      prevGrossRevenue: prevTotalRevenue / 100,
      percentageChange
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching gross revenue`);
  }
}

async function getNewCustomers(stripe: Stripe) {
  try {
    const newCustomers = await stripe.customers.list({
      created: {
        gte: Math.floor(startOfCurrentMonth.getTime() / 1000),
        lte: Math.floor(endOfCurrentMonth.getTime() / 1000)
      },
      limit: 100
    });

    const lastMonthsCustomers = await stripe.charges.list({
      created: {
        gte: Math.floor(startOfPreviousMonth.getTime() / 1000),
        lte: Math.floor(endOfPreviousMonth.getTime() / 1000)
      },
      limit: 100
    });

    const percentageChange = Math.round(
      ((newCustomers.data.length - lastMonthsCustomers.data.length) /
        lastMonthsCustomers.data.length) *
        100
    );
    return {
      newCustomers: newCustomers.data.length,
      prevCustomers: lastMonthsCustomers.data.length,
      percentageChange
    };
  } catch (error) {
    console.error('Error fetching new customers:', error);
    throw new Error(`Error fetching new customers`);
  }
}

async function getNewInvoices(stripe: Stripe) {
  try {
    const invoices = await stripe.invoices.list({
      created: {
        gte: Math.floor(startOfCurrentMonth.getTime() / 1000),
        lte: Math.floor(endOfCurrentMonth.getTime() / 1000)
      },
      limit: 100
    });

    const filteredInvoices = invoices.data.filter(
      (invoice) => invoice.status !== 'draft' && invoice.status !== 'void'
    );

    const lastMonthsInvoices = await stripe.invoices.list({
      created: {
        gte: Math.floor(startOfPreviousMonth.getTime() / 1000),
        lte: Math.floor(endOfPreviousMonth.getTime() / 1000)
      },
      limit: 100
    });

    const lastMonthsFilteredInvoices = lastMonthsInvoices.data.filter(
      (invoice) => invoice.status !== 'draft' && invoice.status !== 'void'
    );

    return {
      newInvoices: filteredInvoices.length,
      prevInvoices: lastMonthsFilteredInvoices.length,
      percentageChange: Math.round(
        ((filteredInvoices.length - lastMonthsFilteredInvoices.length) /
          lastMonthsFilteredInvoices.length) *
          100
      )
    };
  } catch (error) {
    console.error('Error fetching new invoices:', error);
    throw new Error(`Error fetching new invoices`);
  }
}

export async function DashboardCards() {
  const stripe = new Stripe(process.env.STRIPE_SECRET!);

  if (!stripe) return null;

  const grossRevenue = await getGrossRevenue();
  const customers = await getNewCustomers(stripe);
  const invoices = await getNewInvoices(stripe);
  const pendingOrders = await db
    .select()
    .from(orders)
    .where(sql`${orders.orderStatus} = 'pending'`);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Suspense fallback={<SkeletonCard />}>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium ">
              <div className="flex flex-row items-center">
                <span className="mr-1">Gross Revenue</span>
                <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardTitle>

            <Badge
              className={
                (grossRevenue.percentageChange ?? 0) > 0
                  ? 'text-xs bg-lime-200 text-lime-950'
                  : 'text-xs bg-yellow-200 text-yellow-950'
              }
              variant="outline"
            >
              {Math.round(grossRevenue.percentageChange) ?? 0}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${grossRevenue.grossRevenue ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ${grossRevenue.prevGrossRevenue ?? 0} previous month
            </p>
          </CardContent>
        </Card>
      </Suspense>
      <Suspense fallback={<SkeletonCard />}>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex flex-row items-center">
                <span className="mr-1">Customers</span>
                <Icons.users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardTitle>
            <Badge
              className={
                (grossRevenue.percentageChange ?? 0) > 0
                  ? 'text-xs bg-lime-200 text-lime-950'
                  : 'text-xs bg-yellow-200 text-yellow-950'
              }
              variant="outline"
            >
              {Math.round(customers.percentageChange) ?? 0}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{customers.newCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {customers.prevCustomers} previous month
            </p>
          </CardContent>
        </Card>
      </Suspense>
      <Suspense fallback={<SkeletonCard />}>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {' '}
              <div className="flex flex-row items-center">
                <span className="mr-1">Orders</span>
                <Icons.creditCard className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardTitle>
            <Badge
              className={
                (grossRevenue.percentageChange ?? 0) > 0
                  ? 'text-xs bg-lime-200 text-lime-950'
                  : 'text-xs bg-yellow-200 text-yellow-950'
              }
              variant="outline"
            >
              {Math.round(invoices.percentageChange) ?? 0}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{invoices.newInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.prevInvoices} previous month
            </p>
          </CardContent>
        </Card>
      </Suspense>
      <Suspense fallback={<SkeletonCard />}>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex flex-row items-center">
                <span className="mr-1">Pending Orders</span>
                <Icons.activity className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
