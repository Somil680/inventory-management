export interface Product {
  name: string
  hsn: string
  category: string
  sub_category: string
  unit: string
  sale_price: null |number
  purchase_price: null |number
  taxes: string
  opening_quantity: number | null
    location: string
    transaction :[]
  created_at?: string | Date // created_at is optional and can be a string or Date object
  updated_at?: string | Date
}
export interface Party {
  name: string
  contact: number | null
  opening_balance: number | null
  party_type: string
  gstIn: string
  gst_type: null | string
  address: string
  email: string
  created_at?: string | Date // created_at is optional and can be a string or Date object
  updated_at?: string | Date
}
