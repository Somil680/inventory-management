'use server'

import prisma from './prisma'

interface InvoiceProducts {
  id: string
  invoice_id: string
  product_id: string
  qty: number
  rate: number
  price_per_unit: number
  amount: number
  description: string
}

// * THIS WILL FETCH A INVOICE PRODUCT
export async function fetchInvoiceProduct() {
  try {
    return await prisma.invoice_product.findMany()
  } catch (error) {
    console.log('🚀 ~ fetchInvoiceProduct ~ error:', error)
    throw new Error('Failed to fetchInvoiceProduct')
  }
}
// * THIS WILL FETCH A INVOICE PRODUCT BASED ON THE PRODUCT ID
export async function fetchInvoiceProductBasedProduct(id: string) {
  console.log("🚀 ~ fetchInvoiceProductBasedProduct ~ id:", id)
  try {
    const invoiceProducts = await prisma.invoice_product.findMany({
      where: { product_id: { equals: id } },
      select: {
        id: true,
        invoice_id: true,
        product_id: true,
        qty: true,
        rate: true,
        price_per_unit: true,
        amount: true,
        description: true,
        invoice: true,
        product: true,
      },
    })
    console.log("🚀 ~ fetchInvoiceProductBasedProduct ~ invoiceProducts:", invoiceProducts)

    // Return an empty array if no invoice products are found
    return invoiceProducts || [] 
  } catch (error) {
    console.log('🚀 ~ fetchInvoiceProductBasedProduct ~ error:', error)
    throw new Error('Failed to fetchInvoiceProductBasedProduct')
  }
}
// * THIS WILL CREATE A INVOICE PRODUCT
export async function createInvoiceProduct(inputItem: InvoiceProducts[]) {
  if (!inputItem || typeof inputItem !== 'object') {
    throw new Error('Invalid input: Product data is required')
  }
  try {
    const dataArray = Array.isArray(inputItem) ? inputItem : [inputItem] // Ensure data is always an array

    console.log('🚀 ~ fetchInvoiceProduct ~ inputItem:', inputItem)
    return await prisma.invoice_product.createMany({
      data: dataArray,
    })
  } catch (error) {
    console.error('🚀 ~ CREATEInvoiceProduct ~ error:', error)
    throw new Error('Failed to CREATEInvoiceProduct')
  }
}
// * THIS WILL UPDATE A INVOICE PRODUCT
export async function updateInvoiceProduct(
  id: string,
  inputItem: InvoiceProducts
) {
  try {
    return await prisma.invoice_product.update({
      where: { id_invoice_id: { id, invoice_id: inputItem.invoice_id } },
      data: {
        invoice_id: inputItem.invoice_id,
        product_id: inputItem.product_id,
        description: inputItem.description,
        qty: inputItem.qty,
        rate: inputItem.rate,
        price_per_unit: inputItem.price_per_unit,
        amount: inputItem.amount,
      },
    })
  } catch (error) {
    console.log('🚀 ~ UPDATEInvoiceProduct ~ error:', error)
    throw new Error('Failed to UPDATEInvoiceProduct')
  }
}

// * THIS WILL DELETE A INVOICE PRODUCT
export async function deleteInvoiceProduct(
  id: string,
  inputItem: InvoiceProducts
) {
  try {
    return await prisma.invoice_product.delete({
      where: { id_invoice_id: { id, invoice_id: inputItem.invoice_id } },
    })
  } catch (error) {
    console.log('🚀 ~ DELETEInvoiceProduct ~ error:', error)
    throw new Error('Failed to DELETEInvoiceProduct')
  }
}
