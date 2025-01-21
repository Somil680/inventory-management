import { supabase } from '@/utils/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { Invoice, SaleItemE } from '../lib/type' // Import your types
// import { setSaleItems } from '@/redux/slices/saleItemsSlice'

interface Props {
  invoice: Invoice
  saleItemsData: {
    saleItems: SaleItemE[]
  }
}
//  invoice_no: string
//  invoice_date: Date | number
//  invoice_type: 'cash' | 'credit' | 'purchase' | null
//  party_id: string
//  bill_amount: number | null
//  discount_on_amount: number
//  payment_type: 'Cash' | 'Online' | 'RTGS' | null
const saveInvoiceAndSaleProducts = async ({
  invoice,
  saleItemsData,
}: Props) => {
  try {
    // 1. Generate a UUID for the invoice
    const invoiceId = uuidv4()
   const invoiceDateISO = new Date(invoice.invoice_date).toISOString()
    // 2. Insert the invoice data
    const { error: invoiceError } = await supabase.from('invoices').insert([
      {
        id: invoiceId, // Use the generated UUID
        invoice_no: invoice.invoice_no,
        invoice_date: invoiceDateISO,
        party_id: invoice.party_id,
        discount_on_amount: invoice.discount_on_amount,
        bill_amount: (invoice.bill_amount)?.toFixed(2),
        payment_type: invoice.payment_type,
        invoice_type: invoice.invoice_type,
      },
    ])

    if (invoiceError) {
      throw invoiceError // Re-throw the error to be caught later
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

      console.log("🚀 ~ saleProductsToInsert:", saleProductsToInsert)
    if (saleProductsToInsert.length > 0) {
      const { error: saleProductError } = await supabase
        .from('sale_product')
        .insert(saleProductsToInsert) // Use insert without onConflict
      if (saleProductError) {
        throw saleProductError
      }
    }

    // dispatch(
    //   setSaleItems([
    //     {
    //       id: '',
    //       name: '',
    //       productId: '',
    //       description: '',
    //       hsn: '',
    //       qty: 1,
    //       rate: 0,
    //       price_per_unit: 0,
    //       amount: 0,
    //     },
    //   ])
    // )

    console.log('Invoice and sale products saved successfully!')
    return true
  } catch (error) {
    console.error('Error saving invoice or sale products:', error)
    // Handle the error appropriately (e.g., display an error message)
    return false
  }
}

export default saveInvoiceAndSaleProducts
