'use client'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { openModal } from '@/redux/slices/modal'
import { ChevronDown, EllipsisVertical, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { AppDispatch } from '@/redux/store'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchBankAccount, fetchBankTransaction } from '@/lib/paymentAction'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  const { data } = useQuery({
    queryKey: ['Payment'],
    queryFn: fetchBankAccount,
  })
  // const [selectedId, setSelectedId] = useState<string | null>(null)
  // console.log("🚀 ~ BankAccount ~ selectedId:", selectedId)
  // const { data: bank_transaction } = useQuery({
  //   queryKey: ['Bank_Transaction'],
  //   queryFn: () => fetchBankTransaction(selectedId ?? ''),
  //   enabled: selectedId !== null
  // })

 function groupOptions(id: string) {
    return queryOptions({
      queryKey: ['Bank_Transaction', id],
      queryFn: () => fetchBankTransaction(id),
      // staleTime: 5 * 1000,
    })
  }
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: bank_transaction } = useQuery({
    ...groupOptions(selectedId ?? ''),
    enabled: !!selectedId,
  })
  
  console.log("🚀 ~ BankAccount ~ bank_transaction:", bank_transaction)
 

  const [filterTransaction, setFilterTransaction] = useState('')
  const [selectProduct, setSelectProduct] = useState<BankAccount[]>()

  const dispatch = useDispatch<AppDispatch>()

  const open = (types: string, data: BankAccount[], id: string, bank: string) => {
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
    // getSaleData(item.id)
    setSelectProduct([item])
  }
  const [searchInput, setSearchInput] = useState('')

  return (
    <main className="w-full flex gap-3 h-full ">
      <section className="bg-white shadow-lg w-2/5 my-3 ml-3 p-3 space-y-3">
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
        <div className="flex justify-end"></div>
        <div>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
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
                  .filter((item) => item.account_name !== 'Cash')
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
                      <TableCell className="text-right">
                        {formatCurrencyINR(item?.balance?.toString() ?? 0)}
                      </TableCell>
                      <TableCell className="text-right w-3">
                        <Popover>
                          <PopoverTrigger>
                            <EllipsisVertical size={20} color="gray" />
                          </PopoverTrigger>
                          <PopoverContent className="flex flex-col p-2 w-24">
                            <Button variant={'link'}>View</Button>
                            <Button variant={'link'}>Delete</Button>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </section>
      <section className=" w-3/5 my-3 mr-3 flex flex-col gap-3">
        <div className=" bg-white shadow-lg h-1/5 w-full p-3 ">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">
              {selectProduct
                ? selectProduct?.map((item) => (item?.account_name ?? 'Unknown').toUpperCase())
                : 'Select Bank'}
            </p>

            {selectProduct && (
              // <Button></Button>

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
                Bank Name
                {selectProduct
                  ? selectProduct?.map((item) => item?.account_holder_name)
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
              label="Search by Type"
              type="text"
              value={filterTransaction}
              onChange={(e) => setFilterTransaction(e.target.value)}
              removeText={() => setFilterTransaction('')}
            />
          </div>
          <div>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Type</TableHead>
                  <TableHead className="w-[100px]">Name</TableHead>
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
                          <TableCell className="">
                            {formatString(item?.transaction_type ?? '')}
                          </TableCell>
                          <TableCell className="w-[100px]">
                            {item.description}
                          </TableCell>
                          <TableCell className="text-right">
                            {/* {formatDate(item?.date)} */}
                          </TableCell>
                          <TableCell
                            // className={
                            //   item.balance === 'purchase'
                            //     ? 'text-red-600 font-semibold text-right'
                            //     : 'text-green-600 font-semibold text-right'
                            // }
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
      </section>
    </main>
  )
}

export default BankAccount
