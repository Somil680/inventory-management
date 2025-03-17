'use server'

import { format, parseISO } from 'date-fns'
import prisma from './prisma'
import { Invoice } from './type'

// * THIS WILL FETCH A INVOICE
export async function fetchInvoices() {
  try {
    return await prisma.invoice.findMany({
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
      },
    })
  } catch (error) {
    console.log('🚀 ~ fetchInvoices ~ error:', error)
    throw new Error('Failed to fetchInvoices')
  }
}
// * THIS WILL FETCH A INVOICE ON TYPE
export async function fetchInvoicesOnType(startDate: string, endDate: string) {
  try {
    //  if (!startDate || !endDate) {
    //    throw new Error('Invalid date range: startDate or endDate is missing.')
    //  }

    //  const parsedStartDate = parseISO(startDate)
    //  const parsedEndDate = parseISO(endDate)

    //  if (!isValid(parsedStartDate) || !isValid(parsedEndDate)) {
    //    throw new Error('Invalid date format.')
    //  }

    //  const formattedStartDate = format(parsedStartDate, 'yyyy-MM-dd')
    //  const formattedEndDate = format(parsedEndDate, 'yyyy-MM-dd')

    //  console.log(
    //    '🚀 ~ fetchInvoicesOnType ~ formattedStartDate:',
    //    formattedStartDate
    //  )
    //  console.log(
    //    '🚀 ~ fetchInvoicesOnType ~ formattedEndDate:',
    //    formattedEndDate
    // )
    
    const formattedStartDate = format(
      parseISO(new Date(startDate).toISOString()),
      'yyyy-MM-dd'
    )
    console.log("🚀 ~ fetchInvoicesOnType ~ formattedStartDate:", formattedStartDate)
    const formattedEndDate = format(
      parseISO(new Date(endDate).toISOString()),
      'yyyy-MM-dd'
    )
    console.log("🚀 ~ fetchInvoicesOnType ~ formattedEndDate:", formattedEndDate)

    return await prisma.invoice.findMany({
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
        party:true,
        bill_amount: true,
      },
    })
  } catch (error) {
    console.log('🚀 ~ fetchInvoices ~ error:', error)
    throw new Error('Failed to fetchInvoices')
  }
}
// * THIS WILL FETCH A INVOICE BASED ON THE PARTY
export async function fetchInvoiceBasedOnParty(id:string) {
  try {
  const invoiceBasedOnParty =  await prisma.invoice.findMany({
      where: {party_id : {equals : id}},
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
      },
  })
    return invoiceBasedOnParty || []
  } catch (error) {
    console.log('🚀 ~ fetchInvoices ~ error:', error)
    throw new Error('Failed to fetchInvoices')
  }
}
// * THIS WILL CREATE A INVOICE
export async function createInvoice(inputItem: Invoice) {
  if (!inputItem || typeof inputItem !== 'object') {
    throw new Error('Invalid input: Product data is required')
  }
  try {
    console.log('🚀 ~ createProduct fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff~ inputItem:', inputItem)
    return await prisma.invoice.create({
      data: {
        id: inputItem.id,
        invoice_no: inputItem.invoice_no,
        invoice_date: inputItem.invoice_date,
        invoice_type: inputItem.invoice_type,
        billing_name: inputItem.billing_name,
        party_id:  inputItem.party_id ?? null ,
        discount_on_amount: inputItem.discount_on_amount,
        bill_amount: inputItem.bill_amount,
        payment_type: inputItem.payment_type ?? null,
      },
    })
  } catch (error) {
    console.error('🚀 ~ createProduct ~ error:', error,)
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
        bill_amount: inputItem.bill_amount,
        payment_type: inputItem.payment_type,
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
