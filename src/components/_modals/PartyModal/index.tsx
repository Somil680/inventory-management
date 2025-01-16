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
import {supabase} from '@/utils/supabase/server'
import { Party } from '@/lib/type'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'

const PartModal = () => {
   const dispatch  = useDispatch()
    const [inputItem, setItemInput] = useState<Party>({
      name: '',
      contact: null,
      opening_balance: null,
      party_type: ' ',
      gstIn: '',
      gst_type: null,
      address: '',
      email: '',
    })
    console.log('🚀 ~ ItemModal ~ inputItem:', inputItem)

    const insertData = async () => {
      const { data, error } = await supabase
        .from('party')
        .insert(inputItem)
        .select() // Insert an array of objects

      if (error) {
        console.error('Error inserting data:', error)
        dispatch(closeModal())
        return null
      }

      console.log('🚀 ~ insertData ~ data:', data)
       dispatch(closeModal())
      return data
    }

    const handleInputChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target
      console.log('🚀 ~ setItemInput ~ setItemInput:', inputItem)
      setItemInput((prev) => {
        return {
          ...prev,
          [name]: value,
        }
      })
    }



  return (
    <div className="">
      <h1 className=" p-6 text-xl text-black font-bold">Add Party</h1>
      <hr />
      <div className="p-6 flex flex-col gap-4 ">
        <div className="flex gap-4 items-center">
          <FloatingInput
            label="Party Name*"
            type="text"
            onChange={handleInputChange}
            name="name"
          />
          <FloatingInput
            label="Contact number"
            type="number"
            onChange={handleInputChange}
            name="contact"
          />
        </div>
        <div className="flex gap-4 items-center">
          <FloatingInput
            label="Opening Balance"
            type="number"
            onChange={handleInputChange}
            name="opening_balance"
          />

          <RadioGroup
            onValueChange={(value) =>
              setItemInput((prev) => {
                return {
                  ...prev,
                  party_type: value,
                }
              })
            }
            className="flex"
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
            onValueChange={(value) =>
              setItemInput((prev) => {
                return {
                  ...prev,
                  gst_type: value,
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
              <SelectItem value="reg_regular ">Registered - Regular</SelectItem>
              <SelectItem value="reg_composite">
                Registered - Composite
              </SelectItem>
            </SelectContent>
          </Select>
          <FloatingInput
            label="GSTIN"
            required={inputItem.gst_type !== 'unregistered'}
            type="number"
            onChange={handleInputChange}
            name="gstIn"
          />
     
        </div>
        {/* Separator */}
        <div className="w-full border-b">
          <p className="text-red-500 font-semibold text-md px-3 py-1 border-b-2  border-red-500 w-fit ">
            Addresses
          </p>
        </div>

        <div className="flex gap-4 items-center ">
          <FloatingInput
            label="Billing Address"
            type="text"
            onChange={handleInputChange}
            name="address"
          />
          <FloatingInput
            label="Email"
            type="email"
            onChange={handleInputChange}
            name="email"
          />
        </div>
        <div className="border-t pt-4 gap-5 flex justify-end items-end ">
          <Button className="" variant={'secondary'}>
            Save & New
          </Button>
          <Button onClick={insertData}>Save</Button>
        </div>
      </div>
    </div>
  )
}

export default PartModal
