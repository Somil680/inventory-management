'use server'

import { format, parseISO } from 'date-fns'
import prisma from './prisma'
import { Invoice } from '@/lib/type'
import { formatPrice } from '@/hooks/hook'

// * THIS WILL FETCH A INVOICE
export async function fetchInvoices() {
  try {
    const invoice = await prisma.invoice.findMany({
      select: {
        id: true,
        invoice_no: true,
        invoice_date: true,
        invoice_type: true,
        billing_name: true,
        party_id: true,
        discount_on_amount: true,
        bill_amount: true,
        payment_type: true,
        party: true,
        payment: true,
        invoice_product: true,
        remaining_amount: true,
        paid_amount: true,
      },
      orderBy: { created_at: 'desc' },
    })
    return invoice.map((item) => ({
      ...item,
      bill_amount: formatPrice(item.bill_amount ?? 0),
      remaining_amount: formatPrice(item.remaining_amount ?? 0),
      paid_amount: formatPrice(item.paid_amount ?? 0),
    }))
  } catch (error) {
    console.log('🚀 ~ fetchInvoices ~ error:', error)
    throw new Error('Failed to fetchInvoices')
  }
}
// * THIS WILL FETCH A INVOICE ON TYPE
export async function fetchInvoicesOnType(startDate: string, endDate: string) {
  try {
    const formattedStartDate = format(
      parseISO(new Date(startDate).toISOString()),
      'yyyy-MM-dd'
    )
    const formattedEndDate = format(
      parseISO(new Date(endDate).toISOString()),
      'yyyy-MM-dd'
    )
    const invoice = await prisma.invoice.findMany({
      where: {
        invoice_date: {
          gte: new Date(`${formattedStartDate}T00:00:00.000Z`), // Start of the day
          lte: new Date(`${formattedEndDate}T23:59:59.999Z`), // End of the day
        },
      },
      select: {
        id: true,
        invoice_date: true,
        invoice_type: true,
        invoice_no: true,
        discount_on_amount: true,
        payment: true,
        party: true,
        bill_amount: true,
        remaining_amount: true,
        paid_amount: true,
      },
      orderBy: { created_at: 'desc' },
    })
    return invoice.map((item) => ({
      ...item,
      bill_amount: formatPrice(item.bill_amount ?? 0),
      remaining_amount: formatPrice(item.remaining_amount ?? 0),
      paid_amount: formatPrice(item.paid_amount ?? 0),
    }))
  } catch (error) {
    console.log('🚀 ~ fetchInvoices ~ error:', error)
    throw new Error('Failed to fetchInvoices')
  }
}
// * THIS WILL FETCH A INVOICE ON TYPE
export async function fetchInvoicesByDate(startDate: string, endDate: string) {
  try {
    const formattedStartDate = format(
      parseISO(new Date(startDate).toISOString()),
      'yyyy-MM-dd'
    )
    const formattedEndDate = format(
      parseISO(new Date(endDate).toISOString()),
      'yyyy-MM-dd'
    )
    const invoice = await prisma.invoice.findMany({
      where: {
        invoice_date: {
          gte: new Date(`${formattedStartDate}T00:00:00.000Z`), // Start of the day
          lte: new Date(`${formattedEndDate}T23:59:59.999Z`), // End of the day
        },
      },
      select: {
        id: true,
        invoice_date: true,
        invoice_type: true,
        invoice_no: true,
        discount_on_amount: true,
        payment: true,
        party: true,
        bill_amount: true,
        remaining_amount: true,
        paid_amount: true,
      },
      orderBy: { created_at: 'asc' },
    })
    return invoice.map((item) => ({
      ...item,
      bill_amount: formatPrice(item.bill_amount ?? 0),
      remaining_amount: formatPrice(item.remaining_amount ?? 0),
      paid_amount: formatPrice(item.paid_amount ?? 0),
    }))
  } catch (error) {
    console.log('🚀 ~ fetchInvoices ~ error:', error)
    throw new Error('Failed to fetchInvoices')
  }
}
// * THIS WILL FETCH A INVOICE BASED ON THE PARTY
export async function fetchInvoiceBasedOnParty(id: string) {
  try {
    const invoiceBasedOnParty = await prisma.invoice.findMany({
      where: { party_id: { equals: id } },
      select: {
        id: true,
        invoice_no: true,
        invoice_date: true,
        invoice_type: true,
        billing_name: true,
        party_id: true,
        discount_on_amount: true,
        bill_amount: true,
        payment_type: true,
        party: true,
        payment: true,
        invoice_product: true,
        remaining_amount: true,
        paid_amount: true,
      },
      orderBy: { created_at: 'desc' },
    })
    return (
      invoiceBasedOnParty.map((item) => ({
        ...item,
        bill_amount: formatPrice(item.bill_amount ?? 0),
        remaining_amount: formatPrice(item.remaining_amount ?? 0),
        paid_amount: formatPrice(item.paid_amount ?? 0),
      })) ?? []
    )
  } catch (error) {
    console.log('🚀 ~ fetchInvoices ~ error:', error)
    throw new Error('Failed to fetchInvoices')
  }
}
// * THIS WILL FETCH A INVOICE BASED ON THE PARTY
// export async function fetchInvoiceLatest(id: string) {
//   // const latestInvoice = await prisma.invoice.findFirst({
//   //   orderBy: { invoice_date: 'desc' }, // Change to { id: 'desc' } if needed
//   // })
//   try {
//     const invoiceBasedOnParty = await prisma.invoice.findFirst({
//       orderBy: { created_at: 'desc' }
      
//     })

//     return (
//       invoiceBasedOnParty.map((item) => ({
//         ...item,
//         bill_amount: formatPrice(item.bill_amount ?? 0),
//         remaining_amount: formatPrice(item.remaining_amount ?? 0),
//         paid_amount: formatPrice(item.paid_amount ?? 0),
//       })) ?? []
//     )
//   } catch (error) {
//     console.log('🚀 ~ fetchInvoices ~ error:', error)
//     throw new Error('Failed to fetchInvoices')
//   }
// }
// * THIS WILL CREATE A INVOICE
export async function createInvoice(inputItem: Invoice) {
  console.log("🚀 ~ createInvoice ~ inputItem:", inputItem)
  if (!inputItem || typeof inputItem !== 'object') {
    throw new Error('Invalid input: Product data is required')
  }
  try {
    return await prisma.invoice.create({
      data: {
        id: inputItem.id,
        // invoice_no: inputItem.invoice_no,
        invoice_date: inputItem.invoice_date,
        invoice_type: inputItem.invoice_type,
        billing_name: inputItem.billing_name,
        party_id: inputItem.party_id ?? null,
        discount_on_amount: inputItem.discount_on_amount,
        bill_amount: BigInt(
          Math.round(Number(inputItem.bill_amount ?? 0) * 100)
        ),
        payment_type: inputItem.payment_type ?? null,
        remaining_amount: BigInt(
          Math.round(Number(inputItem.remaining_amount ?? 0) * 100)
        ),
        paid_amount: BigInt(
          Math.round(Number(inputItem.paid_amount ?? 0) * 100)
        ),
      },
    })
  } catch (error) {
    console.error('🚀 ~ createProduct ~ error:', error)
    throw new Error('Failed to create product')
  }
}
// * THIS WILL UPDATE A INVOICE
export async function updateInvoice(id: string, inputItem: Invoice) {
  try {
    return await prisma.invoice.update({
      where: { id },
      data: {
        invoice_no: inputItem.invoice_no,
        invoice_date: inputItem.invoice_date,
        invoice_type: inputItem.invoice_type,
        billing_name: inputItem.billing_name,
        party_id: inputItem.party_id,
        discount_on_amount: inputItem.discount_on_amount,
        payment_type: inputItem.payment_type,
        bill_amount: BigInt(
          Math.round(Number(inputItem.bill_amount ?? 0) * 100)
        ),
        remaining_amount: BigInt(
          Math.round(Number(inputItem.remaining_amount ?? 0) * 100)
        ),
        paid_amount: BigInt(
          Math.round(Number(inputItem.paid_amount ?? 0) * 100)
        ),
      },
    })
  } catch (error) {
    console.log('🚀 ~ updateInvoice ~ error:', error)
    throw new Error('Failed to updateInvoice')
  }
}

// * THIS WILL DELETE A INVOICE
export async function deleteInvoice(id: string) {
  try {
    return await prisma.invoice.delete({ where: { id } })
  } catch (error) {
    console.log('🚀 ~ deleteInvoice ~ error:', error)
    throw new Error('Failed to deleteInvoice')
  }
}
