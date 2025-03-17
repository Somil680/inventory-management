'use client'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { openModal } from '@/redux/slices/modal'
import { IndianRupee, Plus } from 'lucide-react'
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
import { AppDispatch } from '@/redux/store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createExpensesCategory,
  fetchExpensesCategory,
} from '@/lib/ExpenseAction'
import { formatCurrencyINR, formatDate } from '@/hooks/hook'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

const ExpensePage = () => {
  const queryClient = useQueryClient()
  const { data: expenseCategory, isLoading } = useQuery({
    queryKey: ['ExpenseCategory'],
    queryFn: fetchExpensesCategory,
  })

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [category, setCategory] = useState({
    id: uuidv4(),
    title: '',
    expense_balance: 0,
  })

  const handleCreateExpenseCategory = useMutation({
    mutationFn: createExpensesCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ExpenseCategory'] })
      toast.success(`Successfully creating a expense category`)
    },
    onError: (error) => {
      toast.error(`Error creating on Party: ${error.message}`)
    },
  })

  const selectedData =
    selectedId &&
    expenseCategory?.filter((item) => item.id.includes(selectedId))

  const [filterTransaction, setFilterTransaction] = useState('')

  const dispatch = useDispatch<AppDispatch>()

  const open = () => {
    dispatch(
      openModal({
        type: 'Expense',
      })
    )
  }
  useEffect(() => {
    if (expenseCategory && expenseCategory.length > 0) {
      setSelectedId(expenseCategory[0].id)
    }
  }, [isLoading, expenseCategory])

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

          <DropdownMenu>
            <DropdownMenuTrigger>
              {' '}
              <Button>
                <Plus /> Add Expense category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full flex flex-col items-end">
              <FloatingInput
                label="Category"
                type="text"
                value={category.title}
                onChange={(e) =>
                  setCategory({ ...category, title: e.target.value })
                }
                className="[300px]"
                removeText={() => setCategory({ ...category, title: '' })}
              />
              <DropdownMenuSeparator />
              <Button
                className="w-fit"
                onClick={() => handleCreateExpenseCategory.mutate(category)}
              >
                Save
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-end"></div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Expense Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseCategory &&
                expenseCategory
                  .filter((item) =>
                    item?.title
                      ?.toLowerCase()
                      .includes(searchInput.toLowerCase())
                  )
                  .map((item) => (
                    <TableRow
                      key={item?.id}
                      onClick={() => {
                        setSelectedId(item.id)
                      }}
                      className={
                        selectedId === item.id ? ' bg-[#f3f4f780]' : ''
                      }
                    >
                      <TableCell className="font-medium">
                        {item?.title?.toUpperCase()}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrencyINR(Number(item?.expense_balance ?? 0))}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </section>
      <section className=" w-3/5 my-3 mr-3 flex flex-col gap-3">
        <div className=" bg-white shadow-lg  w-full p-3 ">
          <div className="flex justify-between">
            <p className="text-lg font-semibold space-x-3">
              Total&nbsp;
              <span>
                {typeof selectedData?.[0] === 'object' &&
                  selectedData?.[0].title?.toLowerCase()}
              </span>
              &nbsp;expense&nbsp; :
              <span className="text-blue-700">
                {typeof selectedData?.[0] === 'object' &&
                  formatCurrencyINR(
                    Number(selectedData?.[0]?.expense_balance ?? 0)
                  )}
              </span>
            </p>

            {selectedId && (
              <Button onClick={open}>
                <IndianRupee />
                Add Expense
              </Button>
            )}
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
          <div className="overflow-y-scroll h-[76dvh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">Sl.No.</TableHead>
                  <TableHead className=" w-[100px]">Date</TableHead>
                  <TableHead className="">Name</TableHead>
                  <TableHead className="text-right w-[100px]">
                    Payment
                  </TableHead>
                  <TableHead className="text-right w-[100px]">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {typeof selectedData?.[0] === 'object' &&
                  selectedData?.[0]?.expense_category?.map(
                    (item, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="">{index + 1}</TableCell>
                        <TableCell className="">
                          {formatDate(item?.expense_date)}
                        </TableCell>
                        <TableCell className="">{item?.item}</TableCell>

                        <TableCell className="">
                          {Array.isArray(item?.payment)
                            ? item?.payment[0]?.map(
                                (paymentItem: { account_name: string }) =>
                                  paymentItem.account_name
                              )
                            : ''}
                        </TableCell>
                        <TableCell className='text-right'>
                          {formatCurrencyINR(Number(item?.bill_amount ?? 0))}
                        </TableCell>
                      </TableRow>
                    )
                  )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ExpensePage
