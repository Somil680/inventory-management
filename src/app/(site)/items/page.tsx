'use client'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { openModal } from '@/redux/slices/modal'
import { Plus, SlidersVertical } from 'lucide-react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supabase } from '@/utils/supabase/server'
import { Product } from '@/lib/type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { setupItemRealtime } from '@/redux/slices/ItemData'
import { formatDate } from '@/hooks/hook'
interface SaleProduct {
  id: string
  invoice_id: string
  product_id: string
  qty: number
  rate: number
  price_per_unit: number
  amount: number
  description: string | null
}

interface Invoice {
  id: string
  customer_type: 'cash' | 'credit'
  customer_name: string | null
  // ... other invoice properties
  invoice_no: number | null
  invoice_date: Date
  discount_on_amount: number
  bill_amount: number | null
  payment_type: 'cash' | 'online_payment'
}

interface TransactionData extends SaleProduct {
  invoice: Invoice // Add invoice data here
}
const Items = () => {
  const [productData, setProductData] = useState<Product[]>([])
  const [subCategoryData, setSubCategoryData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  // const [categoryid, setCategoryid] = useState<string>('')
  // console.log('🚀 ~ Items ~ productData:', productData)
  const [selectProduct, setSelectProduct] = useState<Product[]>()
  const [filterProduct, setFilterProduct] = useState<any>('')
  // console.log('🚀 ~ Items ~ filterProduct:', filterProduct)

  const fetchAllFromTable = async () => {

    try {
      const { data: productData, error: productError } = await supabase
        .from('product')
        .select('*')
      
      const { data: subCategoryData, error: subCategoryError } = await supabase
        .from('sub_category')
        .select('*')
      const { data: categoryData, error: categoryError } = await supabase
        .from('category')
        .select('*')

      if (productError) {
        throw productError // Throw the error to be caught by the try...catch block
      }
      if (subCategoryError) {
        throw subCategoryError
      }
      if (categoryError) {
        throw categoryError
      }
      setProductData(productData)
      setSubCategoryData(subCategoryData)
      setCategoryData(categoryData)
      return { productData, subCategoryData, categoryData }
    } catch (err) {
      console.error('Error fetching data:', err)
      //  setError(err.message || 'An error occurred while fetching data.') // Set error message
      return null // Return null in case of error
    } finally {
      //  setLoading(false) // Set loading to false regardless of success or failure
    }
  }

  // async function insertIntoTable() {
  //   const { data, error } = await supabase
  //     .from('products')
  //     .insert([{ id: '323' }]) // Insert an array of objects

  //   if (error) {
  //     console.error('Error inserting data:', error)
  //     return null
  //   }

  //   return data
  // }
  const [transaction , setTransaction ]  = useState<any[]>([])
  console.log("🚀 ~ Items ~ transaction:", transaction)
 const getTransactionData = async (id: string): Promise<TransactionData[]> => {
   try {
     const { data, error } = await supabase
       .from('sale_product')
       .select(`*,invoices (*)`)
       .eq('product_id', id)
     if (error) {
       throw error
     }
     if (data) {
       // Flatten the data structure
       const transactionData: TransactionData[] = data.map((saleProduct) => ({
         ...saleProduct,
         ...saleProduct.invoices[0], // Access the first (and only) invoice
       }))
        setTransaction(transactionData)
       return transactionData
     }

     return []
   } catch (error) {
     console.error('Error fetching transaction data:', error)
     return []
   }
 }


  const dispatch = useDispatch()
  const open = () => {
    dispatch(
      openModal({
        type: 'Items',
      })
    )
    console.log('🚀 ~ open ~ open:')
  }
  useEffect(() => {
    fetchAllFromTable() // Fetch initial data

    const unsubscribe = setupItemRealtime(dispatch) // Set up real-time listener

    return () => {
      unsubscribe() // Unsubscribe when the component unmounts
    }
  }, [dispatch])

  return (
    <main className="w-full flex gap-3 h-full ">
      <section className="bg-white shadow-lg w-2/4 my-3 ml-3 p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <FloatingInput
            label="Search"
            className="w-full"
            type="text"
            value={filterProduct}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFilterProduct(e.target.value)
            }
          />
          <Button onClick={() => open()}>
            <Plus /> Add Item
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-semibold">Filter :</p>
          <Select onValueChange={(value) => setFilterProduct(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryData.map((item) => (
                <>
                  <SelectItem key={item.id} value={item.value}>
                    {item.title}
                  </SelectItem>
                </>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setFilterProduct(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subCategoryData.map((item) => (
                <>
                  <SelectItem key={item.id} value={item.title}>
                    {item.title}
                  </SelectItem>
                </>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData
                .filter(
                  (item) =>
                    item.name
                      .toLowerCase()
                      .includes(filterProduct.toLowerCase()) ||
                    item.category
                      .toLowerCase()
                      .includes(filterProduct.toLowerCase()) ||
                    item.sub_category
                      .toLowerCase()
                      .includes(filterProduct.toLowerCase())
                )
                .map((item) => (
                  <TableRow
                    key={item?.id}
                    onClick={() => {
                      setSelectProduct([item])
                      getTransactionData(item?.id)
                    }}
                  >
                    <TableCell className="font-medium">{item?.name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <span className="bg-gray-50 p-2 rounded-lg">
                        {item?.category}
                      </span>
                      <span className="bg-gray-50 p-2 rounded-lg">
                        {item?.sub_category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.opening_quantity}
                    </TableCell>
                    <TableCell className="text-right">=</TableCell>
                  </TableRow>
                ))}
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
        </div>
      </section>
      <section className=" w-2/4 my-3 mr-3 flex flex-col gap-3">
        {/* ITEM DETAILS-------------------------------------------------------------------------------------------------- */}

        <div className=" bg-white shadow-lg h-1/5 w-full p-3 ">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">
              {selectProduct
                ? selectProduct?.map((item) => item?.name)
                : 'Select Product'}
            </p>
            <Button onClick={() => fetchAllFromTable()}>
              <SlidersVertical />
              Adjust Item
            </Button>
          </div>
          <div className="flex justify-between space-y-6 items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-400">
                SALE PRICE:{' '}
                <span className="text-green-600">
                  {' '}
                  &#8377;:
                  {selectProduct
                    ? selectProduct?.map((item) => item?.sale_price)
                    : 'null'}
                </span>
              </p>
              <p className="text-sm font-semibold text-gray-400">
                PURCHASE PRICE:{' '}
                <span className="text-green-600">
                  {' '}
                  &#8377;:
                  {selectProduct
                    ? selectProduct?.map((item) => item?.purchase_price)
                    : 'null'}{' '}
                </span>
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-400">
                STOCK QUANTITY:{' '}
                <span className="text-green-600">
                  {' '}
                  &#8377;:
                  {selectProduct
                    ? selectProduct?.map((item) => item?.opening_quantity)
                    : 'null'}{' '}
                </span>
              </p>
              <p className="text-sm font-semibold text-gray-400">
                STOCK VALUE:{' '}
                <span className="text-green-600">
                  {' '}
                  &#8377;:
                  {selectProduct
                    ? selectProduct?.map((item, index) => {
                        const openingQuantity =
                          typeof item?.opening_quantity === 'number'
                            ? item.opening_quantity
                            : 0
                        const salePriceValue =
                          typeof item.sale_price === 'number'
                            ? item?.sale_price
                            : 0

                        return (
                          <span key={index}>
                            {openingQuantity * salePriceValue}
                          </span>
                        )
                      })
                    : 'null'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* TABLE INFORMATION---------------------------------------------------------------------------------------------- */}
        <div className=" bg-white shadow-lg p-3 h-4/5">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">TRANSACTION</p>
            <FloatingInput label="Search" type="text" />
          </div>
          <div>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Sl.no</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[100px]">Invoice no.</TableHead>
                  <TableHead className="text-right">Name</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price/Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-[100px]">{index + 1}</TableCell>
                    <TableCell className="w-[100px]">{item.invoices.invoice_type }</TableCell>
                    <TableCell className="w-[100px]">
                      {item.invoices.invoice_no}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.invoices.customer_name}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDate(item.invoices.invoice_date)}
                    </TableCell>
                    <TableCell className="text-right">{item.qty}</TableCell>
                    <TableCell className="text-right">
                      {item.price_per_unit}
                    </TableCell>
                  </TableRow>
                ))}
                {/* <TableCell className="w-[100px]">Sale</TableCell>
                <TableCell className="w-[100px]">2.</TableCell>
                <TableCell className="text-right">OM</TableCell>
                <TableCell className="text-right">12/12/12</TableCell>
                <TableCell className="text-right">100</TableCell>
                <TableCell className="text-right">123.32</TableCell>
                <TableCell className="text-right">Active</TableCell> */}
              </TableBody>
              {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter> */}
            </Table>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Items
