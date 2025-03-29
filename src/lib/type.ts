export interface Product {
  id: string
  name: string
  hsn: string
  category: string
  sub_category: string
  unit: string | null
  sale_price:  number | bigint
  purchase_price: number | bigint
  taxs: number
  opening_quantity: number
  location: string
  created_at?: string | Date // created_at is optional and can be a string or Date object
  updated_at?: string | Date
}
export interface Party {
  id: string
  name: string
  contact: number | null
  opening_balance: number | null
  pay_amount: number | null
  receive_amount: number | null
  party_type: null | 'to_receive' | 'to_pay'
  gstIn: string
  gst_type: null | 'unregistered' | 'reg_regular' | 'reg_composite'
  address: string
  email: string
  created_at?: string | Date // created_at is optional and can be a string or Date object
  updated_at?: string | Date
}
export interface InvoiceProduct {
  // id: string
  name: string
  description: string
  hsn: string
  qty: number
  rate: number
  price_per_unit: number
  amount: number
}
export interface InvoiceProducts {
  id: string
  invoice_id: string
  product_id: string
  qty: number
  rate: number
  price_per_unit: number
  amount: number
  description: string
}
export interface Invoice {
  id: string
  billing_name: string
  invoice_no: string
  invoice_date: Date | string
  invoice_type:
    | 'cash'
    | 'credit'
    | 'purchase'
    | 'add_stock'
    | 'reduce_stock'
    | 'sale_return'
    | 'purchase_return'
    | 'payment_in'
    | 'payment_out'
    | null
  party_id: string | null
  bill_amount: number 
  discount_on_amount: number
  payment_type: string | null
  remaining_amount : number
  paid_amount : number
  // payment_type: 'Cash' | 'Online' | 'RTGS' | 'UnPaid' | null
}
export interface SaleItem {
  id: string
  name: string
  description: string
  hsn: string
  qty: number
  rate: number
  price_per_unit: number
  amount: number
}
export interface BankAccountInput {
  id: string
  account_name: string
  balance: number
  account_number: number
  IFSC_code: string
  upi_number: string
  account_holder_name: string
}

export interface BankAccount {
  id: string
  account_number: number | null
  IFSC_code: string | null
  upi_number: string | null
  account_holder_name: string | null
  balance: number | null
  account_name: string | null
}

export type BankTransaction = {
  id: string
  from_bank_id: string | null
  to_bank_id: string | null
  transaction_type:
    | 'cash_withdrawal'
    | 'cash_deposit'
    | 'opening_balance'
    | 'bank_to_bank'
    | 'bank_adjustment_increase'
    | 'bank_adjustment_decrease'
    | null
  description: string
  date: Date | string
  balance: number | null
}
export interface SaleItemE {
  id: string
  name: string
  productId: string
  description: string
  hsn: string
  qty: number | null
  tax: number | null
  taxAmt: number | null
  rate: number | null
  price_per_unit: number | null
  amount: number | null
}
export interface InvoiceItem {
  invoice_no: string
  invoice_date: Date | string
  invoice_type: 'cash' | 'credit' | 'purchase' | null
  party_id: string
  party: Party[]
  bill_amount: number | null
  discount_on_amount: number
  payment_type: 'Cash' | 'Online' | 'RTGS' | null
}

export interface TransactionData extends SaleItem {
  invoice: Invoice // Add invoice data here
}
export interface Category {
  title: string // Add invoice data here
  id: string // Add invoice data here
  category_id: string // Add invoice data here
}
export interface CategoryData {
  category: Category[]
  sub_category: Category[]
}
export interface Transaction {
  id: string
  qty: number
  description: string
  price_per_unit: number
  invoices: {
    invoice_no: string
    invoice_date: Date | string
    invoice_type: 'cash' | 'credit' | 'purchase' | null
    party_id: string
    bill_amount: number | null
    discount_on_amount: number
    payment_type: 'Cash' | 'Online' | 'RTGS' | null
    party: {
      name: string
    }
  }
}
export interface ShowingProduct {
  id: string
  name: string
  category: { tittle: string }
  sub_category: { tittle: string }
  opening_quantity: number
}
