'use client'
import { Input } from '@/components/ui/input'
import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {supabase} from '@/utils/supabase/server'
import { Product } from '@/lib/type'

const ItemModal = () => {
  const [inputItem, setItemInput] = useState<Product>({
    id: '',
    name: '',
    hsn: '',
    category: '',
    sub_category: '',
    unit: '',
    sale_price: null,
    purchase_price: null,
    taxes: '',
    opening_quantity: null,
    location: '',
    transaction: []
  })
    const [subCategoryData, setSubCategoryData] = useState<any[]>([])
    const [categoryData, setCategoryData] = useState<any[]>([])
   const fetchAllFromTable = async () => {
      //  setLoading(true) // Set loading state before fetching
      //  setError(null) // Clear any previous errors
  
      try {
        const { data: subCategoryData, error: subCategoryError } = await supabase
          .from('sub_category')
          .select('*')
        const { data: categoryData, error: categoryError } = await supabase
          .from('category')
          .select('*')

        if (subCategoryError) {
          throw subCategoryError
        }
        if (categoryError) {
          throw categoryError
        }
        setSubCategoryData(subCategoryData)
        setCategoryData(categoryData)
        return {  subCategoryData, categoryData }
      } catch (err) {
        console.error('Error fetching data:', err)
        //  setError(err.message || 'An error occurred while fetching data.') // Set error message
        return null // Return null in case of error
      } finally {
        //  setLoading(false) // Set loading to false regardless of success or failure
      }
    }



  const insertData = async () => {
    const Jsondata = {
 
      name: inputItem.name,
      hsn: inputItem.hsn,
      category: inputItem.category,
      sub_category: inputItem.sub_category,
      unit: inputItem.unit,
      sale_price: inputItem.sale_price,
      purchase_price: inputItem.purchase_price,
      taxes: inputItem.taxes,
      opening_quantity: inputItem.opening_quantity,
      location: inputItem.location,
      transaction: inputItem.transaction,
    }
    const { data, error } = await supabase.from('product').insert(Jsondata).select() // Insert an array of objects

    if (error) {
      console.error('Error inserting data:', error)
      return null
    }

    console.log('🚀 ~ insertData ~ data:', data)
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
  useEffect(() => {
    fetchAllFromTable()
  }, [])
  return (
    <div className="">
      <h1 className=" p-6 text-xl text-black font-bold">Add Item</h1>
      <hr />
      <div className="p-6 flex flex-col gap-4 ">
        <div className="flex gap-4 items-center">
          <Input
            className="w-[300px] "
            type="text"
            placeholder="Item name"
            name="name"
            onChange={handleInputChange}
          />
          <Input
            className="w-[300px] "
            type="text"
            placeholder="Item HSN"
            name="hsn"
            onChange={handleInputChange}
          />
          <Select
            onValueChange={(value) =>
              setItemInput((prev) => {
                return {
                  ...prev,
                  unit: value,
                }
              })
            }
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel className="text-blue-600 bg-blue-100 rounded-full px-2 flex items-center justify-center">
                   Unit
                </SelectLabel> */}
                <Separator className="my-1" />
                <SelectItem value="liter">LTR</SelectItem>
                <SelectItem value="bucket">BUK</SelectItem>
                <SelectItem value="cartoon">CART</SelectItem>
                <SelectItem value="kilogram">KG</SelectItem>
                <SelectItem value="milligram">ML</SelectItem>
                <SelectItem value="gram">GR</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>{' '}
        </div>
        <div className="flex gap-4 items-center">
          <Select
            onValueChange={(value) =>
              setItemInput((prev) => {
                return {
                  ...prev,
                  category: value,
                }
              })
            }
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-blue-600 bg-blue-100 rounded-full px-2 flex items-center justify-center">
                  Add New Category
                </SelectLabel>
                <Separator className="my-1" />
                {categoryData.map((item) => (
                  <>
                    <SelectItem key={item.id} value={item.title}>
                      {item.title}
                    </SelectItem>
                  </>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              setItemInput((prev) => {
                return {
                  ...prev,
                  sub_category: value,
                }
              })
            }
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Sub Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-blue-600 bg-blue-100 rounded-full px-2 flex items-center justify-center">
                  Add New SubCategory
                </SelectLabel>
                <Separator className="my-1" />

                {subCategoryData.map((item) => (
                  <>
                    <SelectItem key={item.id} value={item.title}>
                      {item.title}
                    </SelectItem>
                  </>
                ))}
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
                name="sale_price"
                onChange={handleInputChange}
              />
              {/* <Select defaultValue="without_tax">
                <SelectTrigger className="w-[120px] ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="without_tax">Without Tax</SelectItem>
                  <SelectItem value="with_tax">With Tax</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
            {/* <div className="flex gap-1">
              <Input
                className="w-[300px]"
                type="number"
                placeholder="Discount on Sale Price"
                name="name"
                onChange={handleInputChange}
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
            </div> */}
          </div>

          <div className="flex flex-col  gap-3 w-1/2">
            <div className="flex flex-col gap-4 bg-neutral-50 rounded-lg border p-4 ">
              <p className="font-semibold text-sm">Purchase Price</p>

              <div className="flex gap-1 ">
                <Input
                  className="w-[300px]"
                  type="number"
                  placeholder="Purchase Price"
                  name="purchase_price"
                  onChange={handleInputChange}
                />
                {/* <Select defaultValue="without_tax">
                  <SelectTrigger className="w-[120px] ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="without_tax">Without Tax</SelectItem>
                    <SelectItem value="with_tax">With Tax</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
            </div>
            <div className="flex flex-col gap-4 bg-neutral-50 rounded-lg border p-4 ">
              <p className="font-semibold text-sm">Taxes</p>
              <div className="flex gap-1 ">
                <Select
                  // defaultValue="18"
                  onValueChange={(value) =>
                    setItemInput((prev) => {
                      return {
                        ...prev,
                        taxes: value,
                      }
                    })
                  }
                >
                  <SelectTrigger className="w-[120px] ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="28">28%</SelectItem>
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
              name="opening_quantity"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-4 bg-neutral-50 rounded-lg border p-4 w-1/2 ">
            <Input
              className="w-[300px]"
              type="text"
              placeholder="Location"
              name="location"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="border-t pt-4 gap-5 flex justify-end items-end ">
          <Button className="" variant={'secondary'}>
            Save & New
          </Button>
          <Button onClick={() => insertData()}>Save</Button>
        </div>
      </div>
    </div>
  )
}

export default ItemModal
