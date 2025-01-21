'use client'
import React, { useEffect, useState } from 'react'
import FloatingInput from '@/components/ui/floating-input'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { fetchItems } from '@/redux/slices/ItemData'
// import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/hooks/hook'
import { Invoice, SaleItem } from '@/lib/type'
import TableSale from '@/components/Table'
export interface SaleItemE {
  id: string
  name: string
  productId: string
  description: string
  hsn: string
  qty: number
  rate: number
  price_per_unit: number
  amount: number
}
const EstimateBill: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const { saleItems , bill_amount } = useSelector((state: RootState) => state.saleItems) // Get saleItems from Redux

  const [invoice, setInvoice] = useState<Omit<Invoice, 'sale_product'> & { sale_product: (SaleItem | SaleItemE)[] }>({
    customer_name: '',
    customer_id: '',
    customer_type: 'cash',
    phone: null,
    discount_on_amount: 0,
    invoice_no: null,
    invoice_date: Date.now(),
    bill_amount: 0,
    sale_product: [],
    payment_type: 'cash',
  })

  const handleInvoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }))
  }

  const handleSubmitInvoice = async () => {
    setInvoice((prev) => {
      return {
        ...prev,
        bill_amount: parseFloat(
          (bill_amount + (bill_amount * 18) / 100).toFixed(2)
        ),
        sale_product: saleItems.filter((item) => item.id !== ''),
      }
    })
  }
    

  useEffect(() => {
    dispatch(fetchItems()) 
  }, [dispatch])

  return (
    <div className="m-2 bg-white  h-full  flex flex-col justify-between">
      <div className="w-full ">
        <div className=" bg-gray-50 p-4 shadow-2xl">
          <h1 className="text-2xl font-bold">Estimate Quotation</h1>
        </div>
        <div className="bg-white">
          <div className="flex justify-between items-start p-10">
            <div className="flex gap-2">
              <div className="p-0 relative ">
                <FloatingInput
                  label="Party Name"
                  className=" w-full  "
                  type="text"
                  name="customer_name"
                  value={invoice.customer_name}
                  onChange={handleInvoiceChange}
                />
              </div>
              <FloatingInput
                label="Invoice Date"
                name="invoice_date"
                value={formatDate(invoice.invoice_date)}
                readOnly
                type="date"
                onChange={handleInvoiceChange}
              />
            </div>
         
          </div>
          <div className="  border ">
            <TableSale />
          </div>
        
        </div>

      
      </div>
      <div className="h-20 shadow-inner w-full bg-white flex items-center justify-end p-4 space-x-3">
        <Button
          className="h-10 w-40"
          variant={'secondary'}
          onClick={() => console.log(invoice)}
        >
          test
        </Button>
        <Button className="h-10 w-40" onClick={handleSubmitInvoice}>
          Convert to Sale
        </Button>
      </div>
    </div>
  )
}

export default EstimateBill
