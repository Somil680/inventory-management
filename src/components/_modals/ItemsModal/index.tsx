import { Input } from '@/components/ui/input'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const ItemModal = () => {
  return (
    <div className="">
      <h1 className=" p-6 text-xl text-black font-bold">Add Item</h1>
      <hr />
      <div className="p-6 flex flex-col gap-4 ">
        <div className="flex gap-4 items-center">
          <Input
            className="w-[300px] border-2"
            type="text"
            placeholder="Item name"
          />
          <Input
            className="w-[300px] border-2"
            type="text"
            placeholder="Email"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Select>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>North America</SelectLabel> */}
                <SelectItem value="asian-paint">Asian Paints</SelectItem>
                <SelectItem value="indigo">Indigo Paints</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Sub Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>North America</SelectLabel> */}
                <SelectItem value="tactor">Tactor Emulsion</SelectItem>
                <SelectItem value="ace">Ace Emulsion</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* Separator */}
        <div className="w-full border-b">
          <p className="text-red-500 font-semibold text-md px-3 py-1 border-b-2  border-red-500 w-fit ">
            Pricing
          </p>
        </div>

        <div className="  flex gap-3 ">
          <div className="flex flex-col gap-4 bg-neutral-50 rounded-lg border p-4 w-1/2  ">
            <p className="font-semibold text-sm">Sale Price</p>
            <div className="flex gap-1 ">
              <Input
                className="w-[300px]"
                type="number"
                placeholder="Sale Price"
              />
              <Select defaultValue="without_tax">
                <SelectTrigger className="w-[120px] ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="without_tax">Without Tax</SelectItem>
                  <SelectItem value="with_tax">With Tax</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-1">
              <Input
                className="w-[300px]"
                type="number"
                placeholder="Discount on Sale Price"
              />
              <Select defaultValue="percentage">
                <SelectTrigger className="w-[120px] ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col  gap-3 w-1/2">
            <div className="flex flex-col gap-4 bg-neutral-50 rounded-lg border p-4 ">
              <p className="font-semibold text-sm">Purchase Price</p>

              <div className="flex gap-1 ">
                <Input
                  className="w-[300px]"
                  type="number"
                  placeholder="Purchase Price"
                />
                <Select defaultValue="without_tax">
                  <SelectTrigger className="w-[120px] ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="without_tax">Without Tax</SelectItem>
                    <SelectItem value="with_tax">With Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-4 bg-neutral-50 rounded-lg border p-4 ">
              <p className="font-semibold text-sm">Taxes</p>
              <div className="flex gap-1 ">
                <Select defaultValue="none">
                  <SelectTrigger className="w-[120px] ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="without_tax">Without Tax</SelectItem>
                    <SelectItem value="with_tax">With Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        {/* Separator */}
        <div className="w-full border-b">
          <p className="text-red-500 font-semibold text-md px-3 py-1 border-b-2  border-red-500 w-fit ">
            Stocks
          </p>
        </div>

        <div className="  flex gap-3 ">
          <div className="flex flex-col gap-4 bg-neutral-50 rounded-lg border p-4 w-1/2  ">
            <Input
              className="w-[300px]"
              type="number"
              placeholder="Opening Quantity"
            />
            <Input
              className="w-[300px]"
              type="number"
              placeholder="Price per Unit"
            />
           
          </div>
            <div className="flex flex-col gap-4 bg-neutral-50 rounded-lg border p-4 w-1/2 ">
            <Input
              className="w-[300px]"
              type="text"
              placeholder="Location"
            />
            <Input
              className="w-[300px]"
              type="Date"
              placeholder="Location"
            />
             
          </div>

          
        </div>
          <div className='border-t pt-4 gap-5 flex justify-end items-end'>
           <Button className='border border-blue-600 text-blue-600'>Save & New</Button>
           <Button className='bg-blue-600'>Save</Button>
          </div>
      </div>
    </div>
  )
}

export default ItemModal
