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
import { supabase } from '@/utils/supabase/server'
import { Party } from '@/lib/type'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { v4 as uuidv4 } from 'uuid'

const PartModal = () => {
  const dispatch = useDispatch()
  const invoiceId = uuidv4()
  const [gstData, setGstData] = useState<{
    message?: string
    data?: { lgnm?: string; pradr?: { adr?: string } }
    flag?: boolean
  } | null>(null)
  console.log('🚀 ~ PartModal ~ gstData:', gstData)

  const [inputItem, setItemInput] = useState<Party>({
    id: invoiceId,
    name: gstData?.data?.lgnm || '',
    contact: '',
    opening_balance: null,
    party_type: 'to_receive',
    gstIn: '',
    gst_type: null,
    address: gstData?.data?.pradr?.adr || '',
    email: '',
  })
  console.log('🚀 ~ ItemModal ~ inputItem:', inputItem)

  const insertData = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    console.log('🚀 ~ insertData ~ inputItem:', inputItem)
    try {
      const { data, error } = await supabase
        .from('party')
        .insert(inputItem)
        .select() // Insert an array of objects

      if (error) {
        console.error('Error inserting data:', error)
        dispatch(closeModal())
      }

      console.log('🚀 ~ insertData ~ data:', data)
    } catch (error) {
      console.log('🚀 ~ insertData ~ error:', error)
    }
    dispatch(closeModal())
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setItemInput((prev) => {
      return {
        ...prev,
        [name]: value,
        name: gstData?.data?.lgnm === 'undefined' ? value : gstData?.data?.lgnm || '',
        address: gstData?.data?.pradr?.adr === 'undefined' ? value : gstData?.data?.pradr?.adr || '',
      }
    })
  }
  const VerifyGSTDetails = async (gstinNumber: string) => {
    const url = `https://sheet.gstincheck.co.in/check/66e10c9804084aefb2a2ed7345d613e4
/${gstinNumber}`

    console.log(
      '🚀 ~ VerifyGSTDetails ~ process.env.GST_API_KEY:',
      process.env.GST_API_KEY
    )
    try {
      const response = await fetch(url, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGstData(data)
      // Assuming  API returns JSON data
      return data
    } catch (error) {
      console.error('Error fetching GST details:', error)
      throw error // Re-throw the error for further handling
    }
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
            value={inputItem.name || gstData?.data?.lgnm}
            required
          />
          <FloatingInput
            label="Contact number"
            type="text"
            onChange={handleInputChange}
            name="contact"
            required
          />
        </div>
        <div className="flex gap-4 items-center">
          <FloatingInput
            label="Opening Balance"
            type="number"
            onChange={handleInputChange}
            name="opening_balance"
            required
          />

          <RadioGroup
            required
            defaultChecked
            defaultValue="to_receive"
            onValueChange={(value) =>
              setItemInput((prev) => {
                return {
                  ...prev,
                  party_type: value,
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
                  required
                  type="text"
                  onChange={handleInputChange}
                  name="gstIn"
                />
                <Button onClick={() => VerifyGSTDetails(inputItem.gstIn)}>
                  Verify
                </Button>
                <p
                  className={`${
                    gstData?.flag === true
                      ? ` text-green-600 font-semibold`
                      : `text-red-600 font-semibold`
                  } `}
                >
                  {gstData && `${gstData.message},  ${gstData.data?.lgnm}`}
                </p>
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
            required
            label="Email"
            type="email"
            value={inputItem.email}
            onChange={handleInputChange}
            name="email"
          />
          <FloatingInput
            className="w-full"
            required
            label="Billing Address"
            type="text"
            value={inputItem.address || gstData?.data?.pradr?.adr}
            onChange={handleInputChange}
            name="address"
          />
        </div>

        <div className="border-t pt-4 gap-5 flex justify-end items-end ">
          <Button className="" variant={'secondary'}>
            Save & New
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  )
}

export default PartModal
