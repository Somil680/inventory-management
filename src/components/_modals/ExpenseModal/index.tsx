import React, { ChangeEvent, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBankAccount } from '@/lib/paymentAction'
import { createExpenses, fetchExpensesCategory } from '@/lib/ExpenseAction'
import { formatDates } from '@/hooks/hook'
interface ExpenseInput {
  id: string
  item: string
  expense_category: string |null
  bill_amount: number |null
  expense_date: Date
  payment_type: string | null
}
const ExpenseModal = () => {
  const queryClient = useQueryClient()
  const { data: paymentType } = useQuery({
    queryKey: ['Payment'],
    queryFn: fetchBankAccount,
  })
  const { data: expenseCategory } = useQuery({
    queryKey: ['ExpenseCategory'],
    queryFn: fetchExpensesCategory,
  })
  const dispatch = useDispatch()

  const [inputItem, setItemInput] = useState<ExpenseInput>({
    id: uuidv4(),
    item: '',
    expense_category: null,
    bill_amount: null,
    expense_date: new Date(),
    payment_type: null as string | null,
  })
  console.log("🚀 ~ ExpenseModal ~ inputItem:", inputItem)

  const handelCreateExpense = useMutation({
    mutationFn: createExpenses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Expenses'] })
      queryClient.invalidateQueries({ queryKey: ['ExpenseCategory'] })
      toast.success(`Successfully Add a Expense`)
    },
    onError: (error) => {
      toast.error(`Error creating on Expense: ${error.message}`)
    },
  })

  const insertData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const submitType: string | undefined = (
      (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    )?.name
    try {
      const data = {
        id: inputItem.id,
        item: inputItem.item,
        expense_category: inputItem.expense_category,
        bill_amount: Number(inputItem.bill_amount),
        expense_date: inputItem.expense_date,
        payment_type: inputItem.payment_type,
      }
      handelCreateExpense.mutate(data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred')
      }
    }
    if (submitType === 'save') {
      dispatch(closeModal())
    } else if (submitType === 'saveandnew') {
      setItemInput({
        id: uuidv4(),
        item: '',
        expense_category: '',
        bill_amount: null,
        expense_date: new Date(),
        payment_type: null,
      })
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setItemInput((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  return (
    <div className="">
      <h1 className=" p-6 text-xl text-black font-bold">Add Expense</h1>
      <hr />
      <form className="p-6 flex flex-col gap-4 " onSubmit={insertData}>
        <FloatingInput
          label="Item Name"
          className="w-full"
          type="text"
          onChange={handleInputChange}
          name="item"
          value={inputItem.item}
          required
        />
        <div className="flex gap-4 items-center">
          <Select
            required
            onValueChange={(value) =>
              setItemInput((prev) => {
                return {
                  ...prev,
                  expense_category: value
                }
              })
            } 
          >
            <SelectTrigger className="w-[300px] ">
              <SelectValue placeholder="Select Expense Category" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategory &&
                expenseCategory.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <FloatingInput
            label="Exp Date"
            type="date"
            value={formatDates(inputItem.expense_date)}
            onChange={handleInputChange}
            name="expense_date"
          />
        </div>
        <div className="flex gap-4 items-center">
          <FloatingInput
            label="Amount"
            type="number"
            value={inputItem.bill_amount ?? ''}
            onChange={handleInputChange}
            name="bill_amount"
          />
          <Select
            required
            onValueChange={(value) =>
              setItemInput((prev) => {
                return {
                  ...prev,
                  payment_type: value as string | null,
                }
              })
            }
          >
            <SelectTrigger className="w-[300px] ">
              <SelectValue placeholder="Select Payment Type" />
            </SelectTrigger>
            <SelectContent>
              {paymentType &&
                paymentType.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.account_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-t pt-4 gap-5 flex justify-end items-end ">
          <Button className="" variant={'secondary'} name="saveandnew">
            Save & New
          </Button>
          <Button type="submit" name="save">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ExpenseModal
