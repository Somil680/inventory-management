'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { formatCurrencyINR, formatDates } from '@/hooks/hook'
import { RootState } from '@/redux/store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Invoice } from '@/lib/type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBankAccount } from '@/lib/paymentAction'
import { createInvoice } from '@/lib/invoiceAction'
import { v4 as uuidv4 } from 'uuid'
import { closeModal } from '@/redux/slices/modal'

const PaymentIn = () => {
  
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { data: paymentType } = useQuery({
    queryKey: ['Payment'],
    queryFn: fetchBankAccount,
  })
  const { index: data } = useSelector((state: RootState) => state.modal) as unknown as { index: string  }
  console.log("🚀 ~ PaymentIn ~ data:", data)
  const [invoice, setInvoice] = useState<Invoice>({
    id: uuidv4(),
    invoice_no: '',
    invoice_date: new Date(),
    invoice_type: 'payment_in',
    party_id: '',
    bill_amount: null,
    payment_type: '',
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
      queryClient.invalidateQueries({ queryKey: ['Invoice'] }) //
      queryClient.invalidateQueries({ queryKey: ['Party'] }) //
      toast.success('Payment received successfully')
      dispatch(closeModal())
    },
    onError: (error) => {
      toast.error('Error on Received Payment')
      console.log('🚀 ~ PaymentIn ~ error:', error)
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const updatedInvoice = {
        ...invoice,
        party_id: data ?? '',
        bill_amount: Number(invoice.bill_amount),
      }
      console.log("🚀 ~ handleSubmit ~ updatedInvoice:", updatedInvoice)
      invoiceMutation.mutate(updatedInvoice)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred')
      }
    }
  }
  useEffect(() => {
    if (data === undefined) {
            dispatch(closeModal())
    }
  } , [data, dispatch])

  return (
    <div className="">
      <h1 className=" p-6 text-xl text-black font-bold">Take Payment</h1>
      <hr />
      <form className=" flex flex-col gap-4 p-4 " onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 items-center">
          <FloatingInput
            label="Enter Adjustment Date"
            name="invoice_date"
            value={formatDates(new Date(invoice.invoice_date))}
            required
            type="date"
            className=""
            onChange={handleInputChange}
          />
          <div className="bg-muted w-full p-3 flex flex-col gap-3 ">
            <div className="flex justify-between w-full">
              <p>Received</p>
              <input
                type="number"
                name="bill_amount"
                className="bg-transparent border-dashed border-b-2  focus:outline-none focus:ring-0 text-black text-right  "
                value={invoice.bill_amount ?? ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-between w-full text-green-600 font-semibold">
              <p>Total Amount</p>
              <p>{formatCurrencyINR(Number(invoice.bill_amount ?? 0))}</p>
            </div>
          </div>
          <Select
            required
            onValueChange={(value) =>
              setInvoice((prev) => ({
                ...prev,
                payment_type: value,
              }))
            }
          >
            <SelectTrigger id="payment" className="w-full">
              <SelectValue placeholder="Select Payment Type" />
            </SelectTrigger>
            <SelectContent>
              {paymentType?.map((item) => (
                <>
                  <SelectItem key={item.id} value={item.id}>
                    {item.account_name}
                  </SelectItem>
                </>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="border-t pt-2  gap-5 flex justify-end items-end ">
          <Button name="save">Save</Button>
        </div>
      </form>
    </div>
  )
}

export default PaymentIn
