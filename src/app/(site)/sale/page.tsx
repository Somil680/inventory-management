'use client'
import DateRangeInput from '@/components/DateRangeSelector'
import FloatingInput from '@/components/ui/floating-input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatCurrencyINR } from '@/hooks/hook'
import {  fetchInvoicesOnType } from '@/lib/invoiceAction'
import { useQuery } from '@tanstack/react-query'
import { Equal, Plus } from 'lucide-react'
import React, { useState } from 'react'

const Page = () => {
  const [selectedDates, setSelectedDates] = useState<{
    date1: string
    date2: string
  }>({
    date1: '',
    date2: '',
  })
  console.log('🚀 ~ Page ~ selectedDates:', selectedDates)

  // const { data: allInvoice } = useQuery({
  //   queryKey: ['Invoice'],
  //   queryFn: fetchInvoices,
  // })

  const { data: invoice } = useQuery({
    queryKey: ['Invoice', selectedDates.date1, selectedDates.date2],
    queryFn: () =>
      fetchInvoicesOnType(selectedDates.date1, selectedDates.date2),
    enabled: !!selectedDates.date1 && !!selectedDates.date2,
    select: (data) =>
      data?.filter(
        (item) =>
          item?.invoice_type?.toLowerCase().includes('cash') ||
          item?.invoice_type?.toLowerCase().includes('credit')
      ),
  })
  const TotalQuantity = () => {
    const total = {
      totalAmount: 0,
      totalPaid: 0,
      totalUnpaid: 0,
    }
    invoice?.forEach((item) => {
      total.totalPaid += Number(item.paid_amount) ?? 0
    })
    invoice?.forEach((item) => {
      total.totalUnpaid += Number(item.remaining_amount) ?? 0
    })
    total.totalAmount = total.totalPaid + total.totalUnpaid
    return total
  }

  // Function to receive data from the child component
  const handleDateChange = (date1: string, date2: string) => {
    setSelectedDates({ date1, date2 })
  }
  const [filter, setFilter] = useState('')

  return (
    <div className="m-3 flex flex-col gap-3">
      <section className="w-full h-52 bg-white p-3 space-y-4 ">
        <div className="flex gap-2 items-center">
          {/* <h2 className="text-2xl font-bold text-gray-800">This month :</h2> */}
          <DateRangeInput onDateChange={handleDateChange} /> 
        </div>
        <div className="flex items-center gap-4">
          <div>
            <span className="h-24 w-36 rounded-xl flex flex-col gap-2 items-center justify-center bg-green-100 text-green-950 font-semibold ">
              <p>PAID</p>
              {formatCurrencyINR(TotalQuantity().totalPaid)}
            </span>
          </div>
          <Plus />
          <div>
            <span className="h-24 w-36 rounded-xl flex flex-col gap-2 items-center justify-center bg-red-100 text-red-950 font-semibold">
              <p>UNPAID</p>
              {formatCurrencyINR(TotalQuantity().totalUnpaid)}
            </span>
          </div>
          <Equal />
          <div>
            <span className="h-24 w-36 rounded-xl flex flex-col gap-2 items-center justify-center bg-blue-100 text-blue-950 font-semibold">
              <p>TOTAL</p>
              {formatCurrencyINR(TotalQuantity().totalAmount)}
            </span>
          </div>
        </div>
      </section>
      <section className=" bg-white shadow-lg p-3 h-full space-y-2">
        <div className="flex justify-between">
          <p className="text-lg font-semibold">TRANSACTION</p>
          <FloatingInput
            label="Search by Name | Type"
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="overflow-y-scroll h-[62dvh] scroll-smooth ">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]">SL.NO.</TableHead>
                <TableHead className="w-24">Date</TableHead>
                <TableHead className="w-[100px]">Invoice no.</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="">Name.</TableHead>
                <TableHead className="text-right">Payment Type</TableHead>
                <TableHead className="text-right w-24">Paid Amt.</TableHead>
                <TableHead className="text-right w-24">Due Amt.</TableHead>
                <TableHead className="text-right w-24">Total Amt.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice &&
                invoice
                  .filter(
                    (item) =>
                      item?.party?.name?.toLowerCase().includes(filter) ||
                      item?.invoice_type?.toLowerCase().includes(filter)
                  )
                  .map((item, index) => (
                    <TableRow key={item?.id}>
                      <TableCell className="">{index + 1}</TableCell>
                      <TableCell className="w-24">
                        {formatDate(item.invoice_date)}
                      </TableCell>
                      <TableCell className="">{item?.invoice_no}</TableCell>
                      <TableCell className="">
                        {item?.invoice_type?.toUpperCase()}
                      </TableCell>
                      <TableCell className="">
                        {item?.party ? item?.party?.name : ''}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.payment?.account_name}
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold text-right">
                        {formatCurrencyINR(item?.paid_amount ?? 0)}
                      </TableCell>
                      <TableCell className="text-red-600 font-semibold text-right">
                        {formatCurrencyINR(item?.remaining_amount ?? 0)}
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold text-right">
                        {formatCurrencyINR(item?.bill_amount ?? 0)}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}

export default Page
