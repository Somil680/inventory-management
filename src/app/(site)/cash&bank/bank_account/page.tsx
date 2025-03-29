'use client'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { openModal } from '@/redux/slices/modal'
import { ChevronDown, LoaderCircleIcon, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrencyINR, formatDate, formatString } from '@/hooks/hook'
import { AppDispatch } from '@/redux/store'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchBankAccount, fetchBankTransaction } from '@/lib/paymentAction'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ActionButton from '@/components/ActionButton'

interface BankAccount {
  id: string
  account_number: number | null
  IFSC_code: string | null
  upi_number: string | null
  account_holder_name: string | null
  balance: number | null
  account_name: string | null
}

const BankAccount = () => {
  // const isFetching = useIsFetching()
  // console.log("🚀 ~ BankAccount ~ isFetching:", isFetching)
  const dispatch = useDispatch<AppDispatch>()
  const [filterTransaction, setFilterTransaction] = useState('')
  const [selectProduct, setSelectProduct] = useState<BankAccount[]>()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['Payment'],
    queryFn: fetchBankAccount,
    select: (data) => data.filter((item) => item.account_name?.toLowerCase() !== "cash"),
  })

  function groupOptions(id: string) {
    return queryOptions({
      queryKey: ['Bank_Transaction', id],
      queryFn: () => fetchBankTransaction(id),
    })
  }
  const { data: bank_transaction } = useQuery({
    ...groupOptions(selectedId ?? ''),
    enabled: !!selectedId,
  })

  const open = (
    types: string,
    data: BankAccount[],
    id: string,
    bank: string
  ) => {
    dispatch(
      openModal({
        type: types,
      })
    )
    if (types === 'BankAccount') {
    } else {
      dispatch(
        openModal({
          type: types,
          data: data,
          types: id,
          index: bank,
        })
      )
    }
  }

  const handleGetData = (item: BankAccount) => {
    setSelectProduct([item])
  }
  useEffect(() => {
    const paymentData = (data ?? []).filter(
      (item) => item.account_name !== 'Cash'
    )
    console.log('🚀 ~ useEffect ~ paymentData:', paymentData)
    setSelectProduct([paymentData[0]])
    setSelectedId(paymentData[0]?.id)
  }, [data])

  return (
    <>
      {!isLoading ? (
        <>
          {' '}
          <main className="w-full flex gap-3 h-full ">
            <section className="bg-white shadow-lg w-1/4 my-3 ml-3 p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <FloatingInput
                  label="Search"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full"
                  removeText={() => setSearchInput('')}
                />
                <Button onClick={() => open('BankAccount', [], '', '')}>
                  <Plus /> Add Bank
                </Button>
              </div>
              <div className="overflow-y-scroll scroll-smooth h-[83dvh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="">ACCOUNT NAME</TableHead>
                      <TableHead className="text-right">AMOUNT</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data &&
                      data
                        .filter(
                          (item) =>
                            // item.account_name !== 'Cash' &&
                            item.account_name
                              ?.toLowerCase()
                              .includes(searchInput.toLowerCase())
                        )
                        .map((item) => (
                          <TableRow
                            key={item?.id}
                            onClick={() => {
                              handleGetData(item)
                              setSelectedId(item.id)
                            }}
                            className={
                              selectProduct?.[0]?.id === item.id
                                ? ' bg-[#f3f4f780]'
                                : ''
                            }
                          >
                            <TableCell className="font-medium">
                              {item?.account_name?.toUpperCase()}
                            </TableCell>
                            <TableCell
                              className={
                                (item?.balance ?? 0) >= 0
                                  ? `text-green-600 text-right font-semibold`
                                  : `text-red-600 text-right font-semibold`
                              }
                            >
                              {formatCurrencyINR(
                                item?.balance?.toString() ?? 0
                              )}
                            </TableCell>
                            <TableCell className="text-right w-3">
                              <ActionButton
                                type={'BankAccount'}
                                editData={item}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>
            </section>
            <section className=" w-3/4 my-3 mr-3 flex flex-col gap-3">
              <div className=" bg-white shadow-lg h-1/5 w-full p-3 ">
                <div className="flex justify-between">
                  <p className="text-lg font-semibold">
                    {selectProduct
                      ? selectProduct?.map((item) =>
                          (item?.account_name ?? 'Unknown').toUpperCase()
                        )
                      : 'Select Bank'}
                  </p>
                  {selectProduct && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="primary">
                          Deposit / Withdraw <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className=" text-left">
                        <DropdownMenuItem
                          onClick={() =>
                            open(
                              'BankAccountTransaction',
                              data ?? [],
                              'Bank to Cash Transfer',
                              selectProduct ? selectProduct[0]?.id : ''
                            )
                          }
                        >
                          Bank to Cash Transfer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            open(
                              'BankAccountTransaction',
                              data ?? [],
                              'Cash to Bank Transfer',
                              selectProduct ? selectProduct[0]?.id : ''
                            )
                          }
                        >
                          Cash to Bank Transfer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            open(
                              'BankAccountTransaction',
                              data ?? [],
                              'Bank to Bank Transfer',
                              selectProduct ? selectProduct[0]?.id : ''
                            )
                          }
                        >
                          Bank to Bank Transfer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            open(
                              'BankAccountTransaction',
                              data ?? [],
                              'Adjust Bank Balance',
                              selectProduct ? selectProduct[0]?.id : ''
                            )
                          }
                        >
                          Adjust Bank Balance
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="flex flex-col  ">
                  <div className=" space-y-1">
                    <p className="text-sm font-semibold text-gray-400">
                      Bank Name:
                      {selectProduct
                        ? selectProduct?.map(
                            (item) => item?.account_holder_name
                          )
                        : 'null'}
                    </p>
                    <p className="text-sm font-semibold text-gray-400">
                      Account number:{' '}
                      {selectProduct
                        ? selectProduct?.map((item) => item?.account_number)
                        : 'null'}{' '}
                    </p>
                    <p className="text-sm font-semibold text-gray-400">
                      IFSC Code:{' '}
                      {selectProduct
                        ? selectProduct?.map((item) => item?.IFSC_code)
                        : 'null'}{' '}
                    </p>
                  </div>
                  <div className="flex justify-between ">
                    <p className="text-sm font-semibold text-gray-400">
                      UPI Number:{' '}
                      {selectProduct
                        ? selectProduct?.map((item) => item?.upi_number)
                        : 'null'}{' '}
                    </p>

                    <p className="text-sm font-semibold text-gray-400">
                      Balance:{' '}
                      {selectProduct
                        ? selectProduct?.map((item) => item?.balance)
                        : 'null'}{' '}
                    </p>
                  </div>
                </div>
              </div>

              <div className=" bg-white shadow-lg p-3 h-full space-y-2">
                <div className="flex justify-between">
                  <p className="text-lg font-semibold">TRANSACTION</p>
                  <FloatingInput
                    label="Search by Type | Name"
                    type="text"
                    value={filterTransaction}
                    onChange={(e) => setFilterTransaction(e.target.value)}
                    removeText={() => setFilterTransaction('')}
                  />
                </div>
                <div className="overflow-y-scroll h-[67dvh] scroll-smooth">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Type</TableHead>
                        <TableHead className="">Name</TableHead>
                        <TableHead className="text-right w-">Date</TableHead>
                        <TableHead className="text-right w-">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bank_transaction &&
                        bank_transaction
                          .filter(
                            (item) =>
                              item?.transaction_type
                                ?.toLowerCase()
                                .includes(filterTransaction.toLowerCase()) ||
                              item?.description
                                ?.toLowerCase()
                                .includes(filterTransaction.toLowerCase())
                          )
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="w-40">
                                {formatString(item?.transaction_type ?? '')}
                              </TableCell>
                              <TableCell className="">
                                {item.transaction_type === 'bank_to_bank'
                                  ? item.to_bank_id === selectProduct?.[0]?.id
                                    ? `From : ${
                                        item
                                          .payment_bank_transaction_from_bank_idTopayment
                                          ?.account_name
                                      } (${item.description?.toLowerCase()})`
                                    : `To : ${
                                        item.payment?.account_name
                                      } (${item.description?.toLowerCase()})`
                                  : item.description}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatDate(item?.date)}
                              </TableCell>
                              <TableCell
                                className={
                                  item.to_bank_id === selectProduct?.[0]?.id
                                    ? 'text-green-600 font-semibold text-right'
                                    : 'text-red-600 font-semibold text-right'
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
            </section>
          </main>
        </>
      ) : (
        <>
          <div className="w-full h-full flex justify-between items-center">
            <LoaderCircleIcon className="animate-spin  w-full  " />
          </div>
        </>
      )}
    </>
  )
}

export default BankAccount
