'use server';

import { unstable_cache } from 'next/cache';
import { db } from '@/db';
import { endOfMonth, startOfMonth } from 'date-fns';

export async function getOrder(orderId: number) {
  const order = await db.query.orders.findFirst({
    where: (model, { eq }) => eq(model.id, orderId)
  });
  return order;
}

export const getOrders = unstable_cache(
  async function getOrders() {
    return await db.query.orders.findMany();
  },
  ['orders'],
  {
    tags: ['orders']
  }
);

export const getPendingOrders = unstable_cache(
  async function getPendingOrders() {
    return await db.query.orders.findMany({
      where: (model, { eq }) => eq(model.orderStatus, 'pending'),
      orderBy: (model, { asc }) => asc(model.dueDate)
    });
  },
  ['pendingOrders'],
  {
    tags: ['pendingOrders']
  }
);

export async function getOrderPaymentsBetweenDates(
  startDate: Date,
  endDate: Date
) {
  const orders = await db.query.orders.findMany({
    where: (model, { and, gte, lte }) =>
      and(gte(model.paymentDate, startDate), lte(model.paymentDate, endDate))
  });

  return orders;
}

export async function getMonthlyFinancials(date: Date) {
  const selfEmploymentTaxRate = 0.153;
  const personalIncomeTaxRate = 0.1;
  const stateIncomeTaxRate = 0.02;
  const taxRate =
    selfEmploymentTaxRate + personalIncomeTaxRate + stateIncomeTaxRate;
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);

  const orders = await db.query.orders.findMany({
    where: (model, { and, gte, lte }) =>
      and(gte(model.paymentDate, startDate), lte(model.paymentDate, endDate))
  });

  const salesTax = Math.round(
    orders.reduce(
      (acc, order) =>
        order.salesTax ? acc + order.salesTax : acc + order.total * 0.0635,
      0
    )
  );
  const grossRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const stripeSales = orders.reduce(
    (acc, order) =>
      order.paymentMethod === 'stripe'
        ? acc + (order.total - order.salesTax)
        : acc,
    0
  );
  const cashSales = orders.reduce(
    (acc, order) =>
      order.paymentMethod === 'cash'
        ? acc + (order.total - order.salesTax)
        : acc,
    0
  );
  const generalSalesGrossRevenue = orders.reduce(
    (acc, order) =>
      order.salesTaxRate === '6.35' ? acc + order.totalExcludingTax : acc,
    0
  );
  const mealSalesGrossRevenue = orders.reduce(
    (acc, order) =>
      order.salesTaxRate === '7.35' ? acc + order.totalExcludingTax : acc,
    0
  );
  const generalSalesTax = orders.reduce(
    (acc, order) =>
      order.salesTaxRate === '6.35' ? acc + order.salesTax : acc,
    0
  );
  const mealsSalesTax = orders.reduce(
    (acc, order) =>
      order.salesTaxRate === '7.35' ? acc + order.salesTax : acc,
    0
  );
  const grossRevenueExcludingTax = orders.reduce(
    (acc, order) => acc + order.totalExcludingTax,
    0
  );

  const grossPayout = Math.round(
    orders.reduce((acc, order) => acc + order.totalExcludingTax * 0.65, 0)
  );
  const taxes = Math.round(grossRevenueExcludingTax * taxRate);
  const netPayout = grossPayout - taxes;
  const reinvest = Math.round(
    orders.reduce((acc, order) => acc + order.totalExcludingTax * 0.35, 0)
  );

  return {
    grossRevenue,
    stripeSales,
    cashSales,
    generalSalesGrossRevenue,
    mealSalesGrossRevenue,
    generalSalesTax,
    mealsSalesTax,
    taxes,
    salesTax,
    grossPayout,
    netPayout,
    reinvest
  };
}

export const getDraws = unstable_cache(
  async function getDraws() {
    return await db.query.draws.findMany({
      where: (model, { eq }) => eq(model.deleted, false),
      orderBy: (model, { asc }) => asc(model.date)
    });
  },
  ['draws'],
  {
    tags: ['draws']
  }
);

export const getExpenses = unstable_cache(
  async function getExpenses() {
    return await db.query.expenses.findMany({
      orderBy: (model, { desc }) => desc(model.date)
    });
  },
  ['expenses'],
  {
    tags: ['expenses']
  }
);
