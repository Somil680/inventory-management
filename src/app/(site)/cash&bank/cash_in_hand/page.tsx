'use client'
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
import { formatCurrencyINR, formatString } from '@/hooks/hook'
import { fetchBankAccount, fetchBankTransaction } from '@/lib/paymentAction'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const CashInHand = () => {
  const { data: paymentType } = useQuery({
    queryKey: ['Payment'],
    queryFn: fetchBankAccount,
  })

  const { data: bank_transaction } = useQuery({
    queryKey: ['Bank_Transaction'],
    queryFn: () =>
      fetchBankTransaction(
        paymentType?.filter(
          (item) => item.account_name?.toLowerCase() === 'cash'
        )[0]?.id ?? ''
      ),
  })
  console.log('🚀 ~ CashInHand ~ bank_transaction:', bank_transaction)
  console.log('🚀 ~ paymentType:', paymentType)
  return (
    <div>
      <div className=" w-full h-14  bg-white flex items-center p-3 gap-3 text-xl">
        CASH IN HAND :
        {paymentType &&
          paymentType
            .filter((item) => item.account_name === 'Cash')
            .map((item) => (
              <>
                <p className="text-green-600 font-semibold">
                  {formatCurrencyINR(item?.balance?.toString() ?? 0)}
                </p>
              </>
            ))}
      </div>
      <div className="bg-white m-3 h-full p-3 space-y-3">
        <div className="flex justify-between">
          <p className="text-lg font-semibold">TRANSACTION</p>
          <div className='flex gap-3'>

          <FloatingInput
            label="Search by Type"
            type="text"
            //  value={filterTransaction}
            //  onChange={(e) => setFilterTransaction(e.target.value)}
            //  removeText={() => setFilterTransaction('')}
          />
          <Button>Cash Adjustment</Button>
          </div>
        </div>
        <div>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Type</TableHead>
                <TableHead className="">Name</TableHead>
                <TableHead className="text-right w-[100px]">Date</TableHead>
                <TableHead className="text-right w-[100px]">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bank_transaction &&
                bank_transaction
                  // .filter((item) =>
                  //   item?.invoice_type
                  //     ?.toLowerCase()
                  //     .includes(filterTransaction.toLowerCase())
                  // )
                  .map((item) => (
                    <>
                      <TableRow>
                        <TableCell className="w-[200px]">
                          {formatString(item?.transaction_type ?? '')}
                        </TableCell>
                        <TableCell className="">{item.description}</TableCell>
                        <TableCell className="text-right">
                          {/* {formatDate(item?.date)} */}
                        </TableCell>
                        <TableCell
                          className={
                            item.transaction_type === 'cash_deposit'
                              ? 'text-red-600 font-semibold text-right'
                              : 'text-green-600 font-semibold text-right'
                          }
                        >
                          {formatCurrencyINR(item?.balance?.toString() ?? '0')}
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default CashInHand
