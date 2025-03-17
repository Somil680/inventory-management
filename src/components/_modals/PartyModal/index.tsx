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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Party } from '@/lib/type'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createParty } from '@/lib/actions'

const PartModal = () => {
  const queryClient = useQueryClient()


  const dispatch = useDispatch()
  const invoiceId = uuidv4()
  const [inputItem, setItemInput] = useState<Party>({
    id: invoiceId,
    name: '',
    contact: null,
    opening_balance: null,
    receive_amount: 0,
    pay_amount: 0,
    party_type: 'to_receive',
    gstIn: '',
    gst_type: null,
    address: '',
    email: '',
  })

  const createPartyDetails = useMutation({
    mutationFn: createParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Party']})
      toast.success(`Successfully creating a Party`)
    },
    onError: (error) => {
      toast.error(`Error creating on Party: ${error.message}`)
    },
  })

  const insertData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const submitType: string | undefined = (
      (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    )?.name
    try {
      const partyDetails = {
        id: inputItem.id,
        name: inputItem.name,
        contact: inputItem.contact,
        opening_balance: inputItem.opening_balance,
        receive_amount:
          inputItem.party_type === 'to_receive' ? inputItem.opening_balance : 0,
        pay_amount:
          inputItem.party_type === 'to_pay' ? inputItem.opening_balance : 0,
        gstIn: inputItem.gstIn,
        gst_type: inputItem.gst_type,
        address: inputItem.address,
        email: inputItem.email,
        party_type: inputItem.party_type,
      }
      createPartyDetails.mutate(partyDetails)
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
        id: invoiceId,
        name: '',
        contact: null,
        opening_balance: null,
        receive_amount: 0,
        pay_amount: 0,
        party_type: 'to_receive',
        gstIn: '',
        gst_type: null,
        address: '',
        email: '',
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
        // name:
        //   gstData?.data?.lgnm === 'undefined'
        //     ? value
        //     : gstData?.data?.lgnm || '',
        // address:
        //   gstData?.data?.pradr?.adr === 'undefined'
        //     ? value
        //     : gstData?.data?.pradr?.adr || '',
      }
    })
  }

  return (
    <div className="">
      <h1 className=" p-6 text-xl text-black font-bold">Add Party</h1>
      <hr />
      <form className="p-6 flex flex-col gap-4 " onSubmit={insertData}>
        <div className="flex gap-4 items-center">
          <FloatingInput
            label="Party Name*"
            type="text"
            onChange={handleInputChange}
            name="name"
            value={inputItem.name}
            required
          />
          <FloatingInput
            label="Contact number"
            type="text"
            onChange={handleInputChange}
            value={inputItem.contact ?? ''}
            name="contact"
          />
        </div>
        <div className="flex gap-4 items-center">
          <FloatingInput
            label="Opening Balance"
            type="number"
            value={inputItem.opening_balance??''}
            onChange={handleInputChange}
            name="opening_balance"
          />

          <RadioGroup
            // disabled
            disabled={
              inputItem.opening_balance === null ||
              Number(inputItem.opening_balance) === 0
            }
            required
            defaultChecked
            defaultValue="to_receive"
            onValueChange={(value) =>
              setItemInput((prev) => {
                return {
                  ...prev,
                  party_type: value as 'to_receive' | 'to_pay' | null,
                }
              })
            }
            className="flex size-10"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="to_receive" id="r1" />
              <Label htmlFor="r1">To Receive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="to_pay" id="r2" />
              <Label htmlFor="r2">To Pay</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="w-full border-b">
          <p className="text-red-500 font-semibold text-md px-3 py-1 border-b-2  border-red-500 w-fit ">
            GST Details
          </p>
        </div>

        <div className="flex gap-4 items-center ">
          <Select
            required
            onValueChange={(value) =>
              setItemInput((prev) => {
                return {
                  ...prev,
                  gst_type: value as
                    | 'unregistered'
                    | 'reg_regular'
                    | 'reg_composite'
                    | null,
                }
              })
            }
          >
            <SelectTrigger className="w-[300px] ">
              <SelectValue placeholder="GST type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unregistered">
                Unregistered/Consumer
              </SelectItem>
              <SelectItem value="reg_regular">Registered - Regular</SelectItem>
              <SelectItem value="reg_composite">
                Registered - Composite
              </SelectItem>
            </SelectContent>
          </Select>
          {inputItem.gst_type !== 'unregistered' &&
            inputItem.gst_type !== null && (
              <>
                <FloatingInput
                  label="GSTIN"
                  value={inputItem.gstIn}
                  required
                  type="text"
                  onChange={handleInputChange}
                  name="gstIn"
                />
              </>
            )}
        </div>

        <div className="w-full border-b">
          <p className="text-red-500 font-semibold text-md px-3 py-1 border-b-2  border-red-500 w-fit ">
            Addresses
          </p>
        </div>

        <div className="flex  gap-4 items-center ">
          <FloatingInput
            label="Email"
            type="email"
            value={inputItem.email}
            onChange={handleInputChange}
            name="email"
          />
          <FloatingInput
            className="w-full"
            label="Billing Address"
            type="text"
            value={inputItem.address}
            onChange={handleInputChange}
            name="address"
          />
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

export default PartModal
