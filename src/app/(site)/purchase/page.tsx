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
import { fetchInvoices } from '@/lib/invoiceAction'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

const Page = () => {
      const { data } = useQuery({
        queryKey: ['Invoice'],
        queryFn: fetchInvoices,
      })


    const [selectedDates, setSelectedDates] = useState<{
      date1: string
      date2: string
    }>({
      date1: '',
      date2: '',
    })
    
    // Function to receive data from the child component
    const handleDateChange = (date1: string, date2: string) => {
      setSelectedDates({ date1, date2 })
    }
  const TotalQuantity = () => {
    let total = 0
    if (data) {
      data.forEach((item) => {
        if (item.invoice_type === 'purchase') {
          total += item.bill_amount ?? 0
        }
      })
    }
    return total
    }
    const [filter , setFilter ]  = useState('')

  return (
    <div className="m-3 flex flex-col gap-3">
      <section className="w-full h-52 bg-white p-3 ">
        <div>
          <p className="font-semibold ">
            Total Purchase:{' '}
            <span className="text-red-600">
              {formatCurrencyINR(TotalQuantity())}
            </span>
          </p>
          <p>This month : </p>
          <DateRangeInput onDateChange={handleDateChange} />
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
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">SL.NO.</TableHead>
              <TableHead className="w-[150px]">Invoice no.</TableHead>
              <TableHead className="">Name.</TableHead>
              <TableHead className="text-right w-40">Invoice Type</TableHead>
              <TableHead className="text-right w-40">Date</TableHead>
              <TableHead className="text-right w-40">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data
              // .filter(
              //   (item) =>
              //    ( item.name.toLowerCase().includes(filter.toLowerCase()) ||
              //     item.invoice_type
              //       .toLowerCase()
              //       .includes(filter.toLowerCase())) &&
              //     (formatDate(item.invoice_date) >= selectedDates.date1 &&
              //       formatDate(item.invoice_date) <= selectedDates.date2)
              // )
              .filter((item) => {
                const lowerFilter = filter.toLowerCase()
                const nameMatch = item?.party?.name.toLowerCase().includes(lowerFilter)
                const invoiceTypeMatch = item?.invoice_type??''
                  .toLowerCase()
                  .includes(lowerFilter)

                // Convert date to a comparable format
                const invoiceDate = formatDate(item.invoice_date) // Ensure format is YYYY-MM-DD
                const startDate = selectedDates.date1
                  ? formatDate(selectedDates.date1)
                  : ''
                const endDate = selectedDates.date2
                  ? formatDate(selectedDates.date2)
                  : ''

                // Check date range only if both dates are selected
                const isStartDateRange =
                  startDate && endDate
                    ? invoiceDate >= selectedDates.date1 &&
                      invoiceDate <= selectedDates.date2
                    : true // If no date range selected, allow all
            

                return (nameMatch || invoiceTypeMatch) && isStartDateRange
              })
              .map((item, index) => (
                <>
                  <TableRow>
                    <TableCell className="">{index + 1}</TableCell>
                    <TableCell className="">{item.invoice_no}</TableCell>
                    <TableCell className="">
                      {item?.party?.name.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item?.invoice_type}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDate(item.invoice_date)}
                    </TableCell>
                    <TableCell
                      className={
                        item.invoice_type === 'purchase'
                          ? 'text-red-600 font-semibold text-right'
                          : 'text-green-600 font-semibold text-right'
                      }
                    >
                      {formatCurrencyINR(item?.bill_amount??0)}
                    </TableCell>
                  </TableRow>
                </>
              ))}
          </TableBody>

          {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter> */}
        </Table>
      </section>
    </div>
  )
}

export default Page
