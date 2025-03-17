'use client'
import React, { ChangeEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { formatDates } from '@/hooks/hook'
import { v4 as uuidv4 } from 'uuid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInvoice } from '@/lib/invoiceAction'
import { createInvoiceProduct } from '@/lib/invoiceProductAction'
import { Invoice, InvoiceProducts } from '@/lib/type'
import { RootState } from '@/redux/store'
import { clearSaleItemsOnSubmit } from '@/redux/slices/saleItem'
import { closeModal } from '@/redux/slices/modal'

const AdjustmentItemModal = () => {
  const queryClient = useQueryClient()
  const saleItemsData = useSelector((state: RootState) => state.saleItems) // Get saleItems from Redux
  const { index } = useSelector((state: RootState) => state.modal) // Get saleItems from Redux
  const dispatch = useDispatch()
  const [qty, setQty] = useState(0)

  const [invoice, setInvoice] = useState<Invoice>({
    id: '',
    invoice_no: '',
    invoice_date: new Date(),
    invoice_type: null,
    party_id: null,
    bill_amount: 0,
    payment_type: null,
    discount_on_amount: 0,
    billing_name: '',
  })

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setInvoice((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const invoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Invoice'] })
      console.log('invoice success')
    },
    onError: () => {
      console.log('invoice error')
    },
  })
  const invoiceProductMutation = useMutation({
    mutationFn: createInvoiceProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Invoice_Product'] })
      queryClient.invalidateQueries({ queryKey: ['Product'] })
      dispatch(clearSaleItemsOnSubmit())
      dispatch(closeModal())
       toast.success('Adjustment Successfully')
      console.log('invoice success product')
    },
    onError: () => {
      console.log('invoice error product')
    },
  })
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const invoiceId = uuidv4()
      const updatedInvoice = {
        ...invoice,
        id: invoiceId,
        billing_name: 'Self Adjust',
        bill_amount: saleItemsData.bill_amount,
        party_id: null,
        payment_type: null,
      }
      console.log('🚀 ~ handleSubmit ~ updatedInvoice:', updatedInvoice)
      invoiceMutation.mutate(updatedInvoice)
      const saleProductsToInsert: InvoiceProducts[] =
        saleItemsData.saleItems.map((saleItem) => ({
          id: uuidv4(),
          invoice_id: invoiceId,
          product_id: typeof index === 'string' ? index : '',
          qty: qty,
          description: saleItem.description ?? '',
          rate: saleItem.rate ?? 0,
          price_per_unit: saleItem.price_per_unit ?? 0,
          amount: saleItem.amount ?? 0,
        }))
      if (saleProductsToInsert.length > 0) {
        invoiceProductMutation.mutate(saleProductsToInsert)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred')
      }
      console.log('🚀 ~ handleSubmit ~ error:', error)
    }
   
  }

  return (
    <div className="">
      <h1 className=" p-6 text-xl text-black font-bold">Adjust Item</h1>
      <hr />
      <form className="p-6 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <RadioGroup
          required
          defaultChecked
          defaultValue="to_receive"
          onValueChange={(value) =>
            setInvoice((prev) => {
              return {
                ...prev,
                invoice_type: value as 'add_stock' | 'reduce_stock' | null,
              }
            })
          }
          className="flex "
        >
          <div className="flex items-center space-x-2 ">
            <RadioGroupItem value="add_stock" id="r-1" className="size-5" />
            <Label className="font-semibold" htmlFor="r-1">
              Add Stock
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="reduce_stock" id="r-2" className="size-5" />
            <Label className="font-semibold" htmlFor="r-2">
              Reduce Stock
            </Label>
          </div>
        </RadioGroup>
        <div className="flex gap-4 items-center">
          <FloatingInput
            label="Enter Adjustment Date"
            name="invoice_date"
            value={formatDates(new Date(invoice.invoice_date))}
            required
            type="date"
            onChange={handleInputChange}
          />
          <FloatingInput
            label="Quantity"
            name="opening_quantity"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            required
          />
        </div>
        <div className="border-t pt-4 gap-5 flex justify-end items-end ">
          <Button name="save">Save</Button>
        </div>
      </form>
    </div>
  )
}

export default AdjustmentItemModal
