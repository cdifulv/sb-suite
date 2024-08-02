import Link from 'next/link';
import Stripe from 'stripe';

import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Icons } from '@/components/icons';

async function getPaidInvoices(stripe: Stripe) {
  try {
    const invoices = await stripe.invoices.list({
      limit: 5,
      status: 'paid'
    });
    return invoices.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export async function DashboardTransactions() {
  const stripe = process.env.STRIPE_SECRET
    ? new Stripe(process.env.STRIPE_SECRET)
    : null;

  if (!stripe) return null;

  const invoices = await getPaidInvoices(stripe);

  return (
    <Card x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Recent paid invoices from stripe.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link
            href={`${siteConfig.links.stripe}/invoices`}
            rel="noopener noreferrer"
            target="_blank"
          >
            View All
            <Icons.arrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="font-medium">{invoice.customer_name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {invoice.customer_email}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  ${(invoice.total / 100).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
