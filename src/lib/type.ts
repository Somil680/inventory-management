export interface Product {
  id: string
  name: string
  hsn: string
  category: string
  sub_category: string
  unit: string
  sale_price: null | number
  purchase_price: null | number
  taxes: string
  opening_quantity: number | null
  location: string
  transaction: []
  created_at?: string | Date // created_at is optional and can be a string or Date object
  updated_at?: string | Date
}
export interface Party {
  id: string
  name: string
  contact: string
  opening_balance: number | null
  party_type: string
  gstIn: string
  gst_type: null | 'unregistered' | 'reg_regular' | 'reg_composite'
  address: string
  email: string
  created_at?: string | Date // created_at is optional and can be a string or Date object
  updated_at?: string | Date
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
// export interface Item {
//   id: string
//   name: string
//   description: string
//   hsn: string
//   sale_price: number
//   opening_quantity: number | null

//   // ... other properties
// }
export interface Invoice {
  invoice_no: string
  invoice_date: Date | number
  invoice_type: 'cash' | 'credit' | 'purchase' | null
  party_id: string
  bill_amount: number | null
  discount_on_amount: number
  payment_type: 'Cash' | 'Online' | 'RTGS' | null
}
// export interface Invoice {
//   customer_type: 'cash' | 'credit'
//   customer_name: string
//   customer_id: string | 'cash12'
//   phone: number | null
//   invoice_no: number | null
//   invoice_date: Date | number
//   discount_on_amount: number
//   bill_amount: number | null
//   payment_type: 'cash' | 'online_payment'
//   invoice_type: 'sale' | 'purchase' | null
// }
export interface SaleItemE {
  id: string
  name: string
  productId: string
  description: string
  hsn: string
  qty: number | null
  rate: number | null
  price_per_unit: number | null
  amount: number | null
}
