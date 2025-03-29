'use client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import FloatingInput from '@/components/ui/floating-input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrencyINR, formatDate, formatString } from '@/hooks/hook'
import { fetchBankAccount, fetchBankTransaction } from '@/lib/paymentAction'
import { BankAccount } from '@/lib/type'
import { openModal } from '@/redux/slices/modal'
import { AppDispatch } from '@/redux/store'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, LoaderCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

const CashInHand = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [filterTransaction, setFilterTransaction] = useState('')
  const { data: paymentType, isLoading } = useQuery({
    queryKey: ['Payment'],
    queryFn: fetchBankAccount,
  })
  const paymentTypeId =
    paymentType?.filter(
      (item) => item.account_name?.toLowerCase() === 'cash'
    )[0]?.id ?? ''

  const { data: bank_transaction } = useQuery({
    queryKey: ['Bank_Transaction', paymentTypeId],
    queryFn: () =>
      fetchBankTransaction(
        paymentType?.filter(
          (item) => item.account_name?.toLowerCase() === 'cash'
        )[0]?.id ?? ''
      ),
  })
  const open = (
    types: string,
    payment: BankAccount[],
    id: string,
    bank: string
  ) => {
    dispatch(
      openModal({
        type: types,
        data: payment,
        types: id,
        index: bank,
      })
    )
  }
  return (
    <main className="h-full">
      {!isLoading ? (
        <>
          <div className=" w-full h-14  bg-white flex items-center justify-between p-3 gap-3 text-xl">
            <p className="flex items-center gap-2">
              CASH IN HAND :
              {paymentType &&
                paymentType
                  .filter((item) => item.account_name === 'Cash')
                  .map((item) => (
                    <>
                      <span
                        className={
                          (item?.balance ?? 0) >= 0
                            ? 'text-green-600 font-semibold'
                            : 'text-red-600 font-semibold'
                        }
                      >
                        {formatCurrencyINR(item?.balance?.toString() ?? 0)}
                      </span>
                    </>
                  ))}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="primary">
                  Cash Adjustment <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className=" text-left">
                <DropdownMenuItem
                  onClick={() =>
                    open(
                      'BankAccountTransaction',
                      paymentType ?? [],
                      'Cash Withdraw',
                      paymentTypeId
                    )
                  }
                >
                  Cash Withdrawal
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    open(
                      'BankAccountTransaction',
                      paymentType ?? [],
                      'Cash Deposit',
                      paymentTypeId
                    )
                  }
                >
                  Cash Deposit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="bg-white m-3  p-3 space-y-3">
            <div className="flex justify-between">
              <p className="text-lg font-semibold">TRANSACTION</p>
              <div className="flex gap-3">
                <FloatingInput
                  label="Search by Type"
                  type="text"
                  value={filterTransaction}
                  onChange={(e) => setFilterTransaction(e.target.value)}
                  removeText={() => setFilterTransaction('')}
                />
              </div>
            </div>
            <div className="overflow-y-scroll scroll-smooth h-[78dvh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">Sl no.</TableHead>
                    <TableHead className=" w-[100px]">Date</TableHead>
                    <TableHead className="w-[200px]">Type</TableHead>
                    <TableHead className="">Name</TableHead>
                    <TableHead className="text-right w-[100px]">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bank_transaction &&
                    bank_transaction
                      .filter((item) =>
                        item?.description
                          ?.toLowerCase()
                          .includes(filterTransaction.toLowerCase())
                      )
                      .map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="">{index + 1}</TableCell>
                          <TableCell className="">
                            {formatDate(item?.date)}
                          </TableCell>
                          <TableCell className="w-[200px]">
                            {formatString(item?.transaction_type ?? '')}
                          </TableCell>
                          <TableCell className="">
                            {' '}
                            {item.to_bank_id ===
                            paymentType?.filter(
                              (item) =>
                                item.account_name?.toLowerCase() === 'cash'
                            )[0]?.id
                              ? `From : ${
                                  item
                                    .payment_bank_transaction_from_bank_idTopayment
                                    ?.account_name
                                } (${item.description?.toLowerCase()})`
                              : `To : ${
                                  item.payment?.account_name
                                } (${item.description?.toLowerCase()})`}
                          </TableCell>

                          <TableCell
                            className={
                              item.transaction_type === 'cash_deposit'
                                ? 'text-red-600 font-semibold text-right'
                                : 'text-green-600 font-semibold text-right'
                            }
                          >
                            {formatCurrencyINR(
                              item?.balance?.toString() ?? '0'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-full flex justify-between items-center">
            <LoaderCircleIcon className="animate-spin  w-full  " />
          </div>
        </>
      )}
    </main>
  )
}

export default CashInHand
