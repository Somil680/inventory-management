import { supabase } from '@//utils/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { Invoice, SaleItemE } from '../lib/type'
interface Props {
  // invoice_table: string
  // product_table: string
  invoice: Invoice
  saleItemsData: {
    saleItems: SaleItemE[]
  }
}
const saveInvoiceAndSaleProducts = async ({
  invoice,
  saleItemsData,
}: Props) => {
  
  try {
    console.log("🚀 ~ invoice:", invoice)
    // 1. Generate a UUID for the invoice
    const invoiceId = uuidv4()
    const invoiceDateISO = new Date(invoice.invoice_date).toISOString()
    // 2. Insert the invoice data


    const { error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        id: invoiceId, // Use the generated UUID
        invoice_no: invoice.invoice_no,
        invoice_date: invoiceDateISO,
        party_id: invoice.party_id,
        discount_on_amount: invoice.discount_on_amount,
        bill_amount: invoice.bill_amount,
        payment_type: invoice.payment_type,
        invoice_type: invoice.invoice_type,
      })

    if (invoiceError) {
      throw invoiceError
    } 

    // 3. Insert sale product data (using the new invoice ID)
    const saleProductsToInsert = saleItemsData.saleItems
      .filter((item) => item.id !== '')
      .map((saleItem) => ({
        invoice_id: invoiceId,
        product_id: saleItem.productId,
        qty: saleItem.qty,
        description: saleItem.description,
        rate: saleItem.rate,
        price_per_unit: saleItem.price_per_unit,
        amount: saleItem.amount,
      }))

    if (saleProductsToInsert.length > 0) {
      console.log('🚀 ~ saleProductsToInsert:', saleProductsToInsert)
      const { error: saleProductError } = await supabase
        .from("sale_product")
        .insert(saleProductsToInsert)
      if (saleProductError) {
        throw saleProductError
      }
    }

    console.log('Invoice and sale products saved successfully!')
    return true



  } catch (error) {
    console.error('Error saving invoice or sale products:', error)
    return false
  }
}

export default saveInvoiceAndSaleProducts
