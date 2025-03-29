'use client'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrencyINR, formatDates } from '@/hooks/hook'
import { fetchParty } from '@/lib/client'
import { createInvoice } from '@/lib/invoiceAction'
import { fetchBankAccount } from '@/lib/paymentAction'
import { Party } from '@/lib/type'
import { closeModal } from '@/redux/slices/modal'
import { AppDispatch } from '@/redux/store'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { ChangeEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

// export const Account_Type = [
//   {
//     name: 'Cash',
//     value: 'cash',
//   },
//   {
//     name: 'Bank 1',
//     value: 'Bank 1',
//   },
//   {
//     name: 'Bank 2',
//     value: 'Bank 2',
//   },
//   {
//     name: 'Bank 3',
//     value: 'Bank 3',
//   },
// ]
const PaymentOut = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data, isLoading, error } = useQuery({
    queryKey: ['Party'],
    queryFn: fetchParty,
  })
  const { data: paymentType } = useQuery({
    queryKey: ['Payment'],
    queryFn: fetchBankAccount,
  })
  const [inputItem, setItemInput] = useState<{
    invoice_no: string
    invoice_date: Date
    payment_type: string | null
    party_id: string
    bill_amount: number 
    remaining_amount: number 
    paid_amount: number
  }>({
    invoice_no: '',
    invoice_date: new Date(),
    payment_type: null,
    party_id: '',
    bill_amount: 0,
    remaining_amount: 0,
    paid_amount: 0,
  })
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const invoiceId = uuidv4()

    setItemInput((prev) => {
      return {
        ...prev,
        id: invoiceId,
        [name]: value,
      }
    })
  }

  const [partyDropdownOpen, setPartyDropdownOpen] = useState(false)
  const [partyDetail, setPartyDetails] = useState({
    party_name: '',
    phone: '',
  })
  const handlePartySelect = (selectedParty: Party) => {
    setPartyDetails((prev) => ({
      ...prev,
      party_name: selectedParty.name,
      phone: selectedParty.contact ? selectedParty.contact.toString() : '',
    }))
    setItemInput((prev) => ({
      ...prev,
      party_id: selectedParty.id,
    }))
    setPartyDropdownOpen(false) // Close the dropdown
  }

  const invoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      console.log('invoice success')
    },
    onError: () => {
      console.log('invoice error')
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const invoiceId = uuidv4()
      const updatedInvoice = {
        ...inputItem,
        id: invoiceId,
        billing_name: '', // Add appropriate value
        invoice_type: 'payment_out' as const, // Add appropriate value
        discount_on_amount: 0, // Add appropriate value
        payment_type: inputItem.payment_type ?? '', // Ensure payment_type is a string
        remaining_amount: inputItem.remaining_amount ?? 0, // Add appropriate value
        paid_amount: inputItem.paid_amount ?? 0, // Add appropriate value
      }

      invoiceMutation.mutate(updatedInvoice)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(`Error on saving payment ${error}`)
      }
      console.log('🚀 ~ handleSubmit ~ error:', error)
    }
    dispatch(closeModal())
    toast.success('Payment Out saved successfully')
  }

  return (
    <div className="w-[800px]">
      <h1 className=" p-6 text-xl text-black font-bold">Payment Out</h1>
      <hr />
      <form className="p-6 flex flex-col gap-4  " onSubmit={handleSubmit}>
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <Label htmlFor="account" className="font-semibold">
              Account :
            </Label>
            <Select
              required
              onValueChange={(value) =>
                setItemInput((prev) => {
                  return {
                    ...prev,
                    payment_type: value,
                  }
                })
              }
            >
              <SelectTrigger id="account" className="w-[300px] ">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                {paymentType &&
                  paymentType.map((item) => (
                    <>
                      <SelectItem value={item.id} key={item.id}>
                        {item.account_name}
                      </SelectItem>
                    </>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <FloatingInput
              label="Invoice No"
              name="invoice_no"
              value={inputItem.invoice_no}
              onChange={handleInputChange}
            />
            <FloatingInput
              label="Invoice Date."
              type="date"
              name="invoice_date"
              value={formatDates(new Date(inputItem.invoice_date))}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className=" bg-[#f3f4f780]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-3 w-2/3 border ">Name</TableHead>
                <TableHead className="p-3 w-1/3 border ">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="h-11">
                <TableCell className="p-0 w-2/3 border ">
                  {' '}
                  <div className="p-0  relative ">
                    <input
                      className=" px-3 bg-transparent w-full h-11  focus:outline-none focus:ring-0 text-black  text-md  "
                      type="text"
                      name="party_name"
                      value={partyDetail.party_name.toUpperCase()}
                      onChange={(e) =>
                        setPartyDetails((prev) => ({
                          ...prev,
                          party_name: e.target.value,
                        }))
                      }
                      onClick={() => setPartyDropdownOpen(true)}
                    />

                    {!isLoading
                      ? partyDropdownOpen && (
                          <div className="absolute top-full left-0 rounded-sm p-2 shadow-sm bg-white border z-50 w-full max-h-96 flex-1  overflow-y-scroll">
                            <table className="w-full leading-7">
                              <tr className="border-b w-full">
                                <th className="text-left">Item </th>
                                <th className="text-right">Balance </th>
                                {/* <th>Quantity</th> */}
                              </tr>

                              {data &&
                                data
                                  .filter((items) =>
                                    items.name
                                      .toLowerCase()
                                      .includes(
                                        partyDetail.party_name.toLowerCase()
                                      )
                                  )
                                  .map((item) => (
                                    <>
                                      <tr
                                        key={item.id}
                                        onClick={() => handlePartySelect(item)}
                                        className="py-1 px-3 cursor-pointer hover:bg-neutral-100 "
                                      >
                                        <td> {item.name}</td>
                                        <td className="text-right">
                                          {formatCurrencyINR(
                                            item?.pay_amount?.toString() ?? 0
                                          )}
                                        </td>
                                      </tr>
                                    </>
                                  ))}
                            </table>
                          </div>
                        )
                      : error
                      ? error
                      : '..loading'}
                  </div>
                </TableCell>
                <TableCell className="p-0 w-2/3 border ">
                  <input
                    type="number"
                    name="amount"
                    value={inputItem.bill_amount ?? ''}
                    onChange={handleInputChange}
                    className=" px-3 bg-transparent w-full h-11  focus:outline-none focus:ring-0 text-black  text-md text-right  "
                  />
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="text-right">Total : </TableCell>
                <TableCell className=" text-right font-semibold">
                  {formatCurrencyINR(inputItem.bill_amount ?? '')}{' '}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="border-t pt-2  gap-5 flex justify-end items-end ">
          <Button name="save">Save</Button>
        </div>
      </form>
    </div>
  )
}

export default PaymentOut
