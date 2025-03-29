// 'use client'
// import { Button } from '@/components/ui/button'
// import FloatingInput from '@/components/ui/floating-input'
// import {
//   Table,
//   TableCaption,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from '@/components/ui/table'
// import { formatCurrencyINR, formatDate } from '@/hooks/hook'
// import { fetchInvoices } from '@/lib/invoiceAction'
// import { openModal } from '@/redux/slices/modal'
// import { supabase } from '@/utils/supabase/server'
// import { useQuery } from '@tanstack/react-query'
// import React, { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'

// const PaymentOut = () => {
//   interface Transaction {
//     invoice_date: string;
//     party: {
//       name: string;
//       pay_amount: number;
//     };
//     payment_type: string;
//     invoice_no: string;
//     amount: number;
//   }
//      const { data, error } = useQuery({
//        queryKey: ['Invoice'],
//        queryFn: fetchInvoices,
//      })
//      console.log("🚀 ~ PaymentOut ~ error:", error)
//   console.log("🚀 ~ PaymentOut ~ data:", data)
  

//   const [transaction, setTransaction] = useState<Transaction[]>([])
//   console.log('🚀 ~ Items ~ transaction:', transaction)
//   const getTransactionData = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('payment_out')
//         .select(`* , party(*)`)
//       if (error) {
//         throw error
//       }

//       setTransaction(data)
//       return data

//     } catch (error) {
//       console.error('Error fetching transaction data:', error)
//       return []
//     }
//   }

//   const dispatch = useDispatch()
//   const open = () => {
//     dispatch(
//       openModal({
//         type: 'PaymentOut',
//       })
//     )
//   }
//   useEffect(() => {
//     getTransactionData()
//   }, [])
//   return (
//     <main>
//       <div className="m-3 flex flex-col gap-3">
//         <section className="w-full h-52 bg-white p-3 ">
//           <div>
//             <p className="font-semibold ">
//               Total Purchase:{' '}
//               <span className="text-red-600">
//                 {/* {formatCurrencyINR(TotalQuantity())} */}
//               </span>
//             </p>
//             <p>This month : </p>
//           </div>
//           <Button onClick={open}>Make Payment</Button>
//         </section>
//         <section className=" bg-white shadow-lg p-3 h-full space-y-2">
//           <div className="flex justify-between">
//             <p className="text-lg font-semibold">TRANSACTION</p>
//             <FloatingInput
//               label="Search"
//               type="text"
//               //   value={filter}
//               //   onChange={(e) => setFilter(e.target.value)}
//             />
//           </div>
//           <Table>
//             <TableCaption>A list of your recent invoices.</TableCaption>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[30px]">SL.NO.</TableHead>
//                 <TableHead className="w-20">Date</TableHead>
//                 <TableHead className="w-ful">Name.</TableHead>
//                 <TableHead className="w-32">Payment Type.</TableHead>
//                 <TableHead className="w-20">Invoice no.</TableHead>
//                 <TableHead className="w-32 text-right">Paid Amount</TableHead>
//                 <TableHead className="w-32 text-right">Re.. Balance</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data &&
//                 data
//                 .filter((item) =>
//                     item?.invoice_type?.toLowerCase().includes("payment_out")
//                   )
//                   .map((item, index: number) => (
//                     <TableRow key={index}>
//                       <TableCell className="">{index + 1}</TableCell>
//                       <TableCell className="">
//                         {formatDate(item.invoice_date)}
//                       </TableCell>
//                       <TableCell className="">{item.party?.name}</TableCell>
//                       <TableCell>{item.invoice_type}</TableCell>
//                       <TableCell className="">{item.invoice_no}</TableCell>
//                       <TableCell className="text-right">
//                         {formatCurrencyINR(item.bill_amount ?? 0)}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         {formatCurrencyINR(
//                           (item?.party && item?.party.pay_amount?.toString()) ?? '0'
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//             </TableBody>

//             {/* <TableFooter>
//               <TableRow>
//                 <TableCell colSpan={3}>Total</TableCell>
//                 <TableCell className="text-right">$2,500.00</TableCell>
//               </TableRow>
//             </TableFooter> */}
//           </Table>
//         </section>
//       </div>
//     </main>
//   )
// }

// export default PaymentOut
'use client'
import DateRangeInput from '@/components/DateRangeSelector'
import { Button } from '@/components/ui/button'
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
import { openModal } from '@/redux/slices/modal'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

const PaymentOut = () => {
  const [selectedDates, setSelectedDates] = useState<{
    date1: string
    date2: string
  }>({
    date1: '',
    date2: '',
  })
  console.log('🚀 ~ Page ~ selectedDates:', selectedDates)

  const { data: invoice } = useQuery({
    queryKey: ['Invoice', selectedDates.date1, selectedDates.date2],
    queryFn: () =>
      fetchInvoicesOnType(selectedDates.date1, selectedDates.date2),
    enabled: !!selectedDates.date1 && !!selectedDates.date2,
    select: (data) =>
      data?.filter((item) =>
        item?.invoice_type?.toLowerCase().includes('payment_out')
      ),
  })
  const TotalQuantity = () => {
    let total = 0
    invoice?.forEach((item) => {
      total += Number(item.paid_amount) ?? 0
    })
    return total
  }

  // Function to receive data from the child component
  const handleDateChange = (date1: string, date2: string) => {
    setSelectedDates({ date1, date2 })
  }
  const [filter, setFilter] = useState('')
  const dispatch = useDispatch()
    const open = () => {
      dispatch(
        openModal({
          type: 'PaymentOut',
        })
      )
    }
  return (
    <div className="m-3 flex flex-col gap-3">
      <section className="w-full  bg-white p-3 space-y-4 ">
        <div className="flex gap-2 items-center">
          <DateRangeInput onDateChange={handleDateChange} />
        </div>
        <div className="flex  items-center gap-4 h-14 px-4   rounded-sm  justify-between bg-blue-100 ">
          <span className=" flex gap-3 text-[#2563eb] font-semibold">
            <p>TOTAL :</p>
            {formatCurrencyINR(TotalQuantity())}
          </span>
          <Button onClick={open}>Make Payment</Button>
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
        <div className="overflow-y-scroll h-[69dvh] scroll-smooth ">
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
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}

export default PaymentOut
