'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Product } from '@/lib/type'
import FloatingInput from '@/components/ui/floating-input'
import { closeModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import CategorySubcategorySelect from '@/components/categorySelect'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduct, updateProduct } from '@/lib/productAction'
import { RootState } from '@/redux/store'
const ItemModal = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { editData } = useSelector((state: RootState) => state.modal) as {
    editData: Product
  }
  const [inputItem, setItemInput] = useState<Product>({
    id: '',
    name: '',
    hsn: '',
    category: '',
    sub_category: '',
    unit: null,
    sale_price: null,
    purchase_price: null,
    taxs: 18,
    opening_quantity: null,
    location: '',
  })

  // console.log('🚀 ~ ItemModal ~ editData:', editData)
  useEffect(() => {
    // if (!editData) return
    if (!editData) return
    if (editData) {
      setItemInput((prev) => {
        console.log('🚀 ~ useEffect ~ editData:', '', editData)
        return {
          ...prev,
          id: editData.id ?? '',
          name: editData.name ?? '',
          hsn: editData.hsn,
          category: editData.category,
          sub_category: editData.sub_category,
          unit: editData.unit,
          sale_price: editData.sale_price,
          purchase_price: editData.purchase_price,
          taxs: editData.taxs,
          opening_quantity: editData.opening_quantity,
          location: editData.location,
        }
      })
    }
  }, [editData])
  console.log('🚀 ~ ItemModal ~ inputItem:', inputItem)

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

  const createProducts = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Product'] })
      toast.success(`Successfully creating on Product`)
    },
    onError: (error) => {
      toast.error(`Error creating on Product: ${error.message}`)
    },
  })
  const handleUpdateProduct = useMutation({
    mutationFn: () => updateProduct(inputItem, editData.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Product'] })
      toast.success(`Successfully Update`)
    },
    onError: (error) => {
      toast.error(`Error  on update Product: ${error.message}`)
    },
  })

  const insertData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const submitType: string | undefined = (
      (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    )?.name
    try {
      if (!editData) {
        createProducts.mutate(inputItem)
      } else {
        handleUpdateProduct.mutate()
      }
    } catch (error) {
      console.log('🚀 ~ insertData ~ error:', error)
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
        id: '',
        name: '',
        hsn: '',
        category: '',
        sub_category: '',
        unit: null,
        sale_price: null,
        purchase_price: null,
        taxs: 18,
        opening_quantity: null,
        location: '',
      })
    }
  }
  return (
    <div className="">
      <h1 className=" p-6 text-xl text-black font-bold">
        {!editData ? 'Add Item' : 'Update Item'}
      </h1>
      <hr />
      <form className="p-6 flex flex-col gap-4 " onSubmit={insertData}>
        <div className="flex gap-4 items-center">
          <FloatingInput
            label="Product Name"
            name="name"
            value={inputItem.name}
            required
            onChange={handleInputChange}
          />
          <FloatingInput
            label="Product HSN"
            name="hsn"
            value={inputItem.hsn}
            onChange={handleInputChange}
            required
          />
          <Select
            required
            name="unit"
            value={inputItem.unit ?? ''}
            onValueChange={(value) =>
              setItemInput((prev) => ({
                ...prev,
                unit: value,
              }))
            }
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <Separator className="my-1" />
                <SelectItem value="null">None</SelectItem>
                <SelectItem value="liter">LTR</SelectItem>
                <SelectItem value="bucket">BUK</SelectItem>
                <SelectItem value="cartoon">CART</SelectItem>
                <SelectItem value="kilogram">KG</SelectItem>
                <SelectItem value="milligram">ML</SelectItem>
                <SelectItem value="gram">GR</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 items-center">
          <Select
            required
            // defaultValue="18"
            // value={inputItem.taxes ?? 18}
            onValueChange={(value) =>
              setItemInput((prev) => {
                return {
                  ...prev,
                  taxes: Number(value),
                }
              })
            }
          >
            <SelectTrigger className="w-[120px] ">
              <SelectValue placeholder="Taxes Rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5"> GST 5%</SelectItem>
              <SelectItem value="12">GST 12%</SelectItem>
              <SelectItem value="18">GST 18%</SelectItem>
              <SelectItem value="28">GST 28%</SelectItem>
            </SelectContent>
          </Select>

          <CategorySubcategorySelect
            inputItem={inputItem}
            setItemInput={setItemInput}
          />
        </div>

        <div className="w-full border-b">
          <p className="text-red-500 font-semibold text-md px-3 py-1 border-b-2  border-red-500 w-fit ">
            Pricing
          </p>
        </div>

        <div className="  flex gap-3 ">
          <FloatingInput
            label="Sale Price"
            type="number"
            name="sale_price"
            required
            value={inputItem.sale_price ?? ''}
            onChange={handleInputChange}
          />

          <FloatingInput
            label="Purchase Price"
            type="number"
            name="purchase_price"
            required
            value={inputItem.purchase_price ?? ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="w-full border-b">
          <p className="text-red-500 font-semibold text-md px-3 py-1 border-b-2  border-red-500 w-fit ">
            Stocks
          </p>
        </div>

        <div className="  flex gap-3 ">
          <FloatingInput
            label="Opening quantity"
            type="number"
            name="opening_quantity"
            required
            value={inputItem.opening_quantity ?? ''}
            onChange={handleInputChange}
          />
          <FloatingInput
            label="Location"
            type="text"
            name="location"
            value={inputItem.location}
            onChange={handleInputChange}
          />
        </div>
        <div className="border-t pt-4 gap-5 flex justify-end items-end ">
          {!editData && (
            <Button variant={'secondary'} name="saveandnew">
              Save & New
            </Button>
          )}
          <Button name="save">Save</Button>
        </div>
      </form>
    </div>
  )
}

export default ItemModal
