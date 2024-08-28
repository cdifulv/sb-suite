'use client';

import { useState } from 'react';
import { getMonthlyFinancials } from '@/db/queries';
import {
  Banknote,
  CreditCard,
  DollarSign,
  HandCoins,
  Landmark,
  PiggyBank,
  Wallet
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Financials = {
  grossRevenue: number;
  stripeSales: number;
  cashSales: number;
  generalSalesGrossRevenue: number;
  mealSalesGrossRevenue: number;
  generalSalesTax: number;
  mealsSalesTax: number;
  taxes: number;
  salesTax: number;
  grossPayout: number;
  netPayout: number;
  reinvest: number;
};
interface FinanceCardsProps {
  financeData: Financials;
  uniqueMonths: { value: Date; label: string }[];
  currentMonth: Date;
}

export function FinanceCards({
  financeData,
  uniqueMonths,
  currentMonth
}: FinanceCardsProps) {
  const [month, setMonth] = useState(currentMonth);
  const [financials, setFinancials] = useState<Financials | null>(financeData);

  async function handleMonthChange(date: string) {
    const newDate = new Date(date);
    setMonth(newDate);
    const financials = await getMonthlyFinancials(newDate);
    setFinancials(financials);
  }

  return (
    <div className="md:w-full">
      <Select value={month.toISOString()} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-full ">
          <SelectValue placeholder="Select a month to display" />
        </SelectTrigger>
        <SelectContent>
          {uniqueMonths.map((month, index) => (
            <SelectItem key={index} value={month.value.toISOString()}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Tabs defaultValue="revenue">
        <div className="flex items-center my-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="sales_tax">Sales Tax</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="revenue">
          <div className="grid gap-4 mb-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">Gross Revenue</span>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {financials?.grossRevenue
                    ? (financials.grossRevenue / 100).toFixed(2)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total revenue for the month (including taxes)
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">Stripe Sales</span>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {financials?.stripeSales
                    ? (financials.stripeSales / 100).toFixed(2)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Payments from Stripe sales after taxes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">Cash Sales</span>
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {financials?.cashSales
                    ? (financials.cashSales / 100).toFixed(2)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Payments from cash sales after taxes
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sales_tax">
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">General Sales Gross Revenue</span>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {financials?.generalSalesGrossRevenue
                    ? (financials.generalSalesGrossRevenue / 100).toFixed(2)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Gross Revenue for General Sales
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">Meal Sales Gross Revenue</span>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {financials?.mealSalesGrossRevenue
                    ? (financials.mealSalesGrossRevenue / 100).toFixed(2)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Gross Revenue for Meal Sales
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">Total Sales Tax</span>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {financials?.salesTax
                    ? (financials.salesTax / 100).toFixed(2)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sales tax for the month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">General Sales Tax</span>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {financials?.generalSalesTax
                    ? (financials.generalSalesTax / 100).toFixed(2)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">Taxed at 6.35%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">Meal Sales Tax</span>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {financials?.mealsSalesTax
                    ? (financials.mealsSalesTax / 100).toFixed(2)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">Taxed at 7.35%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="income">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">Gross Payout</span>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {financials?.grossPayout
                    ? (financials.grossPayout / 100).toFixed(2)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  65% of total revenue excluding sales taxes and expenses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">Taxes</span>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${financials?.taxes ? (financials.taxes / 100).toFixed(2) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total taxes based on gross payout
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">Net Payout</span>
                    <HandCoins className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {financials?.netPayout
                    ? (financials.netPayout / 100).toFixed(2)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total payout after taxes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex flex-row items-center">
                    <span className="mr-2">Reinvest</span>
                    <PiggyBank className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {financials?.reinvest
                    ? (financials.reinvest / 100).toFixed(2)
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  35% of total revenue for future investments
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
