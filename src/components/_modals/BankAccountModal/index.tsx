import React, { ChangeEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Checkbox } from '@/components/ui/checkbox'
import { createBankAccount } from '@/lib/paymentAction'

const BankAccountModal = () => {
  // const { editData } = useSelector((state: RootState) => state.modal)
  // console.log("🚀 ~ BankAccountModal ~ editData:", editData)
  const queryClient = useQueryClient()
  const [upiCheck, setUpiCheck] = useState(false)

  const dispatch = useDispatch()
  const invoiceId = uuidv4()

  const [inputItem, setItemInput] = useState({
    id: invoiceId,
    account_name: '',
    balance: null,
    account_number: null,
    IFSC_code: '',
    upi_number: '',
    account_holder_name: '',
  })
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
  const handleCreateBankAccount = useMutation({
    mutationFn: createBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Payment'] })
      toast.success(`Successfully creating a Bank Account`)
    },
    onError: (error) => {
      toast.error(`Error creating on Party: ${error.message}`)
    },
  })

  const insertData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const AccountDetails = {
        id: invoiceId,
        account_name: inputItem.account_name,
        balance: inputItem.balance??0,
        account_number: Number(inputItem.account_number) ?? 0,
        IFSC_code: inputItem.IFSC_code,
        upi_number: inputItem.upi_number,
        account_holder_name: inputItem.account_holder_name,
      }
      console.log("🚀 ~ insertData ~ AccountDetails:", AccountDetails)
      handleCreateBankAccount.mutate(AccountDetails)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred')
      }
    }
    setItemInput({
      id: invoiceId,
      account_name: '',
      balance: null,
      account_number: null,
      IFSC_code: '',
      upi_number: '',
      account_holder_name: '',
    })
    dispatch(closeModal())
  }
  return (
    <div className="w-[1200px] h-[800px]">
      <h1 className=" p-6 text-xl text-black font-bold">Add Bank Account</h1>
      <hr />
      <form
        className="p-6 h-[90%] flex flex-col justify-between gap-4 "
        onSubmit={insertData}
      >
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 items-center">
            <FloatingInput
              label="Account Display Name"
              type="text"
              onChange={handleInputChange}
              name="account_name"
              value={inputItem.account_name}
              required
            />
            <FloatingInput
              label="Opening Balance"
              type="number"
              onChange={handleInputChange}
              value={inputItem.balance ?? ''}
              name="balance"
            />
            <FloatingInput
              label="As of Date"
              type="date"
              value={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="flex flex-col gap-4  bg-neutral-50 border py-4 px-3 rounded-sm">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                className="size-5"
                onCheckedChange={() => setUpiCheck(!upiCheck)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Print QR Code on Invoice
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms1" className="size-5" />
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Print Account Details on Invoice
              </label>
            </div>
            {upiCheck === true && (
              <div className="flex gap-2">
                <FloatingInput
                  label="Account Number"
                  type="number"
                  onChange={handleInputChange}
                  name="account_number"
                  value={inputItem.account_number ?? ''}
                  required
                />
                <FloatingInput
                  label="IFSC Code"
                  type="text"
                  onChange={handleInputChange}
                  value={inputItem.IFSC_code}
                  name="IFSC_code"
                />
                <FloatingInput
                  label="UPI ID for QR Code"
                  type="text"
                  value={inputItem.upi_number}
                  onChange={handleInputChange}
                  name="upi_number"
                />
                <FloatingInput
                  label="Bank Name"
                  type="text"
                  value={inputItem.account_holder_name}
                  onChange={handleInputChange}
                  name="account_holder_name"
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4 gap-5 flex justify-end items-end ">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  )
}
export default  BankAccountModal
