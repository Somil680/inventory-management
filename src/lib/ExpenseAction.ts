'use server'

import { format ,parseISO } from 'date-fns'
import prisma from '../lib/prisma'

export async function fetchExpenses(startDate: string, endDate: string) {
  console.log("🚀 ~ fetchExpenses ~ endDate:", endDate)
  console.log("🚀 ~ fetchExpenses ~ startDate:", startDate)
  try {
    // Convert input dates to ISO format (YYYY-MM-DD) for Prisma filtering
    const formattedStartDate = format(parseISO(new Date(startDate).toISOString()), "yyyy-MM-dd")
    const formattedEndDate = format(parseISO(new Date(endDate).toISOString()), "yyyy-MM-dd")

    return await prisma.expenses.findMany({
      where: {
        expense_date: {
          gte: new Date(`${formattedStartDate}T00:00:00.000Z`), // Start of the day
          lte: new Date(`${formattedEndDate}T23:59:59.999Z`),  // End of the day
        }
      },
      select: {
        id: true,
        payment: true,
        bill_amount: true,
        expense_date : true
      },
      
    })
  } catch (error) {
    console.log('🚀 ~ fetchProperties ~ error:', error)
    throw new Error('Failed to fetch properties')
  }
}
export async function fetchExpensesCategory() {
  try {
    return await prisma.expenses_category.findMany({
      select: {
        id: true,
        title: true,
        expense_category: {
          select: {
            expense_date: true,
            item: true,
            bill_amount: true,
            payment: {
              select: {
                account_name: true,
              },
            },
          },
        },
        expense_balance: true,
      },
    })
  } catch (error) {
    console.log('🚀 ~ fetchProperties ~ error:', error)
    throw new Error('Failed to fetch properties')
  }
}
interface ExpenseCategoryInput {
  id: string
  title: string
  expense_balance: number
}
// * CREATE EXPENSE CATEGORY
export async function createExpensesCategory(inputItem: ExpenseCategoryInput) {
  if (!inputItem || typeof inputItem !== 'object') {
    throw new Error('Invalid input: Product data is required')
  }
  try {
    return await prisma.expenses_category.create({
      data: {
        id: inputItem.id,
        title: inputItem.title,
        expense_balance: Number(inputItem.expense_balance),
      },
    })
  } catch (error) {
    console.log('🚀 ~ fetchProperties ~ error:', error)
    throw new Error('Failed to fetch properties')
  }
}
// * CREATE EXPENSE
interface ExpenseInput {
  id: string
  item: string
  expense_category: string | null
  bill_amount: number | null
  expense_date: Date
  payment_type: string | null
}

export async function createExpenses(inputItem: ExpenseInput) {
  console.log('🚀 ~ createExpenses ~ inputItem:', inputItem)
  if (!inputItem || typeof inputItem !== 'object') {
    throw new Error('Invalid input: Product data is required')
  }
  try {
    return await prisma.expenses.create({
      data: {
        item: inputItem.item,
        expense_category: inputItem.expense_category,
        bill_amount: Number(inputItem.bill_amount),
        expense_date: inputItem.expense_date,
        payment_type: inputItem.payment_type,
      },
    })
  } catch (error) {
    console.log('🚀 ~ createExpenses ~ error:', error)
    throw new Error('Failed to createExpenses')
  }
}
