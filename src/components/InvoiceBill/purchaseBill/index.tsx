'use client'
import React, { useEffect, useState } from 'react'
import FloatingInput from '@/components/ui/floating-input'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { Button } from '@/components/ui/button'
import { formatCurrencyINR, formatDates } from '@/hooks/hook'
import { Invoice, InvoiceProducts } from '@/lib/type'
import TableSale from '@/components/Table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { v4 as uuidv4 } from 'uuid'

import { toast } from 'sonner'
import { clearSaleItemsOnSubmit } from '@/redux/slices/saleItem'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createInvoice } from '@/lib/invoiceAction'
import { createInvoiceProduct } from '@/lib/invoiceProductAction'
import { fetchBankAccount } from '@/lib/paymentAction'
import { fetchParty } from '@/lib/client'
import { Checkbox } from '../../ui/checkbox'
import { IndianRupee } from 'lucide-react'
interface InvoiceBillProps {
  invoiceType: string
}
interface PartyDetails {
  name: string
  contact?: bigint | null
  id: string
}
const PurchaseInvoiceBill: React.FC<InvoiceBillProps> = ({ invoiceType }) => {
  const queryClient = useQueryClient()
  const dispatch: AppDispatch = useDispatch()
  const saleItemsData = useSelector((state: RootState) => state.saleItems) // Get saleItems from Redux
  const [amountReceivedCheck, setAmountReceivedCheck] = useState(false)
  const [partyDropdownOpen, setPartyDropdownOpen] = useState(false)
  const [invoice, setInvoice] = useState<Invoice>({
    id: '',
    invoice_no: '',
    invoice_date: new Date(),
    invoice_type: invoiceType as
      | 'cash'
      | 'purchase'
      | 'sale_return'
      | 'purchase_return'
      | 'add_stock'
      | 'reduce_stock'
      | 'payment_in'
      | 'payment_out'
      | 'credit'
      | null,
    party_id: null,
    bill_amount: 0,
    payment_type: '',
    discount_on_amount: 0,
    billing_name: '',
    remaining_amount: 0,
    paid_amount: 0,
  })
  const [partyDetail, setPartyDetails] = useState({
    party_name: '',
    phone: '',
  })

  const { data: paymentType } = useQuery({
    queryKey: ['Payment'],
    queryFn: fetchBankAccount,
  })
  const { data: party, isLoading } = useQuery({
    queryKey: ['Party'],
    queryFn: fetchParty,
  })

  const handleInvoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }))
  }

  const handlePartySelect = (selectedParty: PartyDetails) => {
    setPartyDetails((prev) => ({
      ...prev,
      party_name: selectedParty.name,
      phone: selectedParty.contact ? selectedParty.contact.toString() : '',
    }))
    setInvoice((prev) => ({
      ...prev,
      party_id: selectedParty.id,
      billing_name: partyDetail?.party_name,
    }))
    setPartyDropdownOpen(false) // Close the dropdown
  }
  const invoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Party'] })
      queryClient.invalidateQueries({ queryKey: ['Product'] })
      toast.success('Invoice created successfully')
      console.log('invoice success')
    },
    onError: (error) => {
      toast.error('Error on Creating Invoice ')
      console.log('invoice error', error)
    },
  })

  const invoiceProductMutation = useMutation({
    mutationFn: createInvoiceProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Product'] })
      console.log('invoice success product')
    },
    onError: (error) => {
      console.log('invoice error product', error)
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const invoiceId = uuidv4()
      const updatedInvoice = {
        ...invoice,
        id: invoiceId,
        invoice_type: invoiceType  as
          | 'cash'
          | 'purchase'
          | 'sale_return'
          | 'purchase_return'
          | 'add_stock'
          | 'reduce_stock'
          | 'payment_in'
          | 'payment_out'
          | 'credit'
          | null,
        party_id: invoice.party_id === '' ? null : invoice.party_id,
        billing_name: invoice.billing_name || partyDetail.party_name,
        bill_amount: saleItemsData.bill_amount,
      }

      await invoiceMutation.mutateAsync(updatedInvoice)

      console.log(
        '🚀 ~ handleSubmit ~ updatedInvoice.paid_amount:',
        updatedInvoice.paid_amount
      )
      if (updatedInvoice.paid_amount > 0) {
        await invoiceMutation.mutateAsync({
          ...updatedInvoice,
          id: uuidv4(),
          invoice_type: 'payment_out',
          invoice_no: '',
          bill_amount: updatedInvoice.paid_amount,
          party_id: updatedInvoice.party_id,
          payment_type: updatedInvoice.payment_type,
          discount_on_amount: updatedInvoice.discount_on_amount,
          billing_name: updatedInvoice.billing_name,
          remaining_amount: 0,
          paid_amount: updatedInvoice.paid_amount,
        })
        console.log('🚀 ~ handleSubmit ~ credit execte this function:')
      }
      const saleProductsToInsert: InvoiceProducts[] = saleItemsData.saleItems
        .filter((item) => item.id !== '')
        .map((saleItem) => ({
          id: uuidv4(),
          invoice_id: invoiceId,
          product_id: saleItem.productId,
          qty: saleItem.qty ?? 0,
          description: saleItem.description ?? '',
          rate: saleItem.rate ?? 0,
          price_per_unit: saleItem.price_per_unit ?? 0,
          amount: saleItem.amount ?? 0,
        }))

      if (saleProductsToInsert.length > 0) {
        saleProductsToInsert.forEach((product) => {
          invoiceProductMutation.mutate(product)
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred')
      }
      console.log('🚀 ~ handleSubmit ~ error:', error)
    }
    setPartyDetails({
      party_name: '',
      phone: '',
    })
    setInvoice({
      id: '',
      billing_name: '',
      invoice_no: '',
      invoice_date: new Date(),
      invoice_type: null,
      party_id: '',
      bill_amount: 0,
      payment_type: '',
      discount_on_amount: 0,
      remaining_amount: 0,
      paid_amount: 0,
    })
    dispatch(clearSaleItemsOnSubmit())
  }

  useEffect(() => {
    setInvoice((prev) => {
      return {
        ...prev,
        paid_amount: amountReceivedCheck ? saleItemsData.bill_amount : 0,
        remaining_amount: amountReceivedCheck
          ? 0
          : saleItemsData.bill_amount - 0,
      }
    })
  }, [saleItemsData.bill_amount, amountReceivedCheck])

  return (
    <form
      className="w-full h-[88dvh] flex flex-col justify-between "
      onSubmit={handleSubmit}
    >
      <div>
        {/* IN THIS DIV HAVE INVOICE INPUT DETAILS */}
        <div className="flex justify-between items-end p-10">
          {/* IN THIS DIV HAVE TOP THREE INPUT  */}
          <div className="flex gap-2">
            <div className="p-0  relative ">
              <FloatingInput
                label={`Party Name *`}
                className=" "
                type="text"
                name="party_name"
                required={invoice.invoice_type === 'credit'}
                value={partyDetail.party_name}
                onChange={(e) =>
                  setPartyDetails((prev) => ({
                    ...prev,
                    party_name: e.target.value,
                  }))
                }
                onClick={() => setPartyDropdownOpen(true)}
              />
              {partyDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 rounded-md py-2 shadow-sm bg-neutral-50 z-50 w-full border-2 border-blue-200">
                  <table className="w-full leading-7 ">
                    <tr className="border-b w-full">
                      <th className="flex justify-between items-center px-3">
                        Name
                      </th>
                    </tr>

                    {!isLoading ? (
                      party &&
                      party.filter((items) =>
                        items.name
                          .toLowerCase()
                          .includes(partyDetail.party_name.toLowerCase())
                      ).length > 0 ? (
                        party
                          .filter((items) =>
                            items.name
                              .toLowerCase()
                              .includes(partyDetail.party_name.toLowerCase())
                          )
                          .map((item) => (
                            <tr key={item.id}>
                              <td
                                onClick={() => {
                                  handlePartySelect(item)
                                  setPartyDropdownOpen(false)
                                }}
                                className=" px-3 cursor-pointer hover:bg-blue-100  hover:rounded-full "
                              >
                                {' '}
                                {item.name}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className=" ">
                            Add{' '}
                            <span className="text-blue-600 font-semibold">
                              `{partyDetail.party_name}`
                            </span>
                            to the Party{' '}
                          </p>
                          <Button size={'sm'}>Add</Button>
                        </div>
                      )
                    ) : (
                      <p>Loading...</p>
                    )}
                  </table>
                </div>
              )}
            </div>
            <FloatingInput
              label="Billing Name"
              className=" "
              type="text"
              name="billing_name"
              value={invoice.billing_name || partyDetail?.party_name}
              onChange={handleInvoiceChange}
            />
            <FloatingInput
              label="Phone"
              name="phone"
              type="number"
              value={partyDetail.phone ?? ''}
              onChange={handleInvoiceChange}
            />
          </div>
          {/* IN THIS DIV HAVE INVOICE DETAILS */}
          <div className="gap-3 flex flex-col">
            <FloatingInput
              required
              label="Invoice No."
              name="invoice_no"
              value={invoice.invoice_no}
              type="number"
              onChange={handleInvoiceChange}
            />
            <FloatingInput
              required
              label="Invoice Date"
              name="invoice_date"
              value={formatDates(new Date(invoice.invoice_date))}
              readOnly
              type="date"
              onChange={handleInvoiceChange}
            />
          </div>
        </div>

        {/* IN THIS DIV HAVE INVOICE TABLE */}
        <div className="border">
          <TableSale type="INPUT" />
        </div>

        {/* IN THIS DIV HAVE INVOICE PAYMENT DETAILS */}
        <div className="flex flex-col gap-4 items-end p-20">
          <div className="flex justify-between items-center w-[23rem]">
            <>
              <Checkbox
                checked={amountReceivedCheck}
                onCheckedChange={() => {
                  setAmountReceivedCheck(!amountReceivedCheck)
                }}
              />
              Paid Amount :
            </>
            <IndianRupee size={16} className="relative left-4" />
            <input
              type="number"
              value={invoice.paid_amount === 0 ? '' : invoice.paid_amount}
              onChange={(e) => {
                const newPaidAmount = Number(e.target.value)
                setInvoice((prev) => ({
                  ...prev,
                  paid_amount: newPaidAmount,
                  remaining_amount: saleItemsData.bill_amount - newPaidAmount, // Ensure due amount updates dynamically
                }))
              }}
              className="border-b border-dashed w-56 focus:outline-none text-right"
            />
          </div>
          <div className="flex justify-between items-center w-[23rem]">
            Due Amount :
            <input
              type="text"
              value={formatCurrencyINR(invoice.remaining_amount)}
              className="border-b border-dashed w-56 focus:outline-none text-right"
            />
          </div>
          <div className="flex justify-between items-center w-[23rem]">
            <p>Payment Type</p>
            <Select
              required
              onValueChange={(value) =>
                setInvoice((prev) => ({
                  ...prev,
                  payment_type: value,
                }))
              }
              value={invoice.payment_type ?? undefined}
              defaultValue={
                (paymentType ?? []).filter(
                  (item) =>
                    item.account_name &&
                    item.account_name.toLowerCase().includes('cash')
                )?.[0]?.id
              }
            >
              <SelectTrigger
                id="payment"
                className="w-56"
                defaultValue={
                  (paymentType ?? []).filter(
                    (item) =>
                      item.account_name &&
                      item.account_name.toLowerCase().includes('cash')
                  )?.[0]?.id
                }
              >
                <SelectValue placeholder="Select Payment Type" />
              </SelectTrigger>
              <SelectContent>
                {paymentType?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.account_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* IN THIS DIV HAVE INVOICE SAVE BUTTON */}
      <div className="h-20 shadow-inner w-full bg-white flex items-center justify-end p-4 space-x-3">
        <Button className="h-10 w-40">Save</Button>
      </div>
    </form>
  )
}

export default PurchaseInvoiceBill
