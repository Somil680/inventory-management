import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBankAccountTransaction } from '@/lib/paymentAction'
import { RootState } from '@/redux/store'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {BankTransaction} from '@/lib/type'
import { toast } from 'sonner'
import { closeModal } from '@/redux/slices/modal'


const BankAccountTransactionModal = () => {
  const {
    data,
    types,
    index: account_id,
  } = useSelector((state: RootState) => state.modal)

  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const invoiceId = uuidv4()
  const [FromToData, setFromToData] = useState<{
    From: typeof data
    to: typeof data
  }>({
    From: [],
    to: [],
  })

  const [inputItem, setItemInput] = useState<BankTransaction>({
    id: invoiceId,
    from_bank_id: null as string | null,
    to_bank_id: null as string | null,
    transaction_type: null,
    description: '',
    date: new Date().toISOString().split('T')[0],
    balance: null,
  })
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setItemInput((prev) => {
      return {
        ...prev,
        from_bank_id:
          (FromToData.From?.[0]?.id ?? null) || inputItem.from_bank_id,
        to_bank_id: inputItem.to_bank_id || (FromToData.to?.[0]?.id ?? null),
        [name]: value,
      }
    })
  }
  const handleCreateBankTransaction = useMutation({
    mutationFn: createBankAccountTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Payment'] })
      toast.success(`Successfully creating a Bank Transaction`)
    },
    onError: (error) => {
      toast.error(`Error creating on Party: ${error.message}`)
    },
  })

  const type = () => {
    switch (types) {
      case 'Bank to Cash Transfer':
        setItemInput({
          ...inputItem,
          transaction_type: 'cash_withdrawal',
        })
        setFromToData({
          ...FromToData,
          From: data?.filter(
            (item) =>
              item.account_name?.toLowerCase() !== 'cash' &&
              item.id ===  account_id
          ),
          to: data?.filter((item) =>
            item.account_name?.toLowerCase().includes('cash')
          ),
        })
        break
      case 'Cash to Bank Transfer':
        setItemInput({
          ...inputItem,
          transaction_type: 'cash_deposit',
        })
        setFromToData({
          ...FromToData,
          From: data?.filter((item) =>
            item.account_name?.toLowerCase().includes('cash')
          ),
          to: data?.filter(
            (item) =>
              item.account_name?.toLowerCase() !== 'cash' &&
              item.id === account_id
          ),
        })
        break
      case 'Bank to Bank Transfer':
        setFromToData({
          ...FromToData,
          From: data?.filter(
            (item) =>
              item.account_name?.toLowerCase() !== 'cash' &&
              account_id &&
              item.id.includes(account_id)
          ),
          to: data?.filter(
            (item) =>
              item.account_name?.toLowerCase() !== 'cash' &&
              item.id !== account_id
          ),
        })

        setItemInput({
          ...inputItem,
          transaction_type: 'bank_to_bank',
        })
        break
      default:
        break
    }
  }

  useEffect(() => {
    type()
  }, [data])

  const insertData =
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {
        console.log("🚀 ~ BankAccountTransactionModal ~ inputItem:", inputItem)
        handleCreateBankTransaction.mutate(inputItem)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('An unknown error occurred')
        }
      }
      setItemInput({
        id: invoiceId,
        from_bank_id: null as string | null,
        to_bank_id: null as string | null,
        transaction_type: null,
        description: '',
        date: new Date().toISOString().split('T')[0],
        balance: null,
      })
      dispatch(closeModal())
    }

  return (
    <div className=" h-[600px]">
      <h1 className=" p-6 text-xl text-black font-bold">{types as string}</h1>
      <hr />
      <form
        className="p-6 h-[90%] flex flex-col justify-between gap-4 "
        onSubmit={insertData}
      >
        <div className="flex flex-col gap-5 ">
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              <Label>From</Label>
              <Select
                value={
                  types === 'Bank to Bank Transfer'
                    ? account_id
                    : inputItem.from_bank_id ||
                      (FromToData?.From && FromToData?.From[0]?.id)
                }
                defaultValue=""
                onValueChange={(value) =>
                  setItemInput((prev) => ({ ...prev, from_bank_id: value }))
                }
              >
                <SelectTrigger
                  className="w-[300px]"
                  disabled={
                    FromToData?.From && FromToData?.From.length === 1
                    // FromToData?.From?.id !== account_id
                  }
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {FromToData.From &&
                      FromToData?.From.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.account_name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>To</Label>
              <Select
                value={
                  inputItem.to_bank_id ||
                  (FromToData?.to && FromToData?.to[0]?.id)
                }
                onValueChange={(value) =>
                  setItemInput((prev) => ({ ...prev, to_bank_id: value }))
                }
              >
                <SelectTrigger
                  className="w-[300px]"
                  disabled={FromToData?.to && FromToData?.to.length === 1}
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {FromToData.to &&
                      FromToData?.to.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.account_name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <FloatingInput
              label="Amount"
              type="number"
              onChange={handleInputChange}
              value={inputItem.balance ?? ''}
              name="balance"
              required
            />
            <FloatingInput
              label="As of Date"
              type="date"
              value={inputItem.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <FloatingInput label="Description" type="text" name="description"  value={inputItem.description} onChange={handleInputChange}/>
        </div>

        <div className="border-t pt-4 gap-5 flex justify-end items-end ">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  )
}
export default BankAccountTransactionModal
