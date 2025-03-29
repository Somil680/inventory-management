'use client'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { openModal } from '@/redux/slices/modal'
import { LoaderCircle, Plus, SlidersVertical, X } from 'lucide-react'
import React, { ChangeEvent, Suspense, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Product } from '@/lib/type'
import { formatCurrencyINR, formatDate } from '@/hooks/hook'
import { AppDispatch } from '@/redux/store'
import CategorySubcategorySelect from '@/components/categorySelect'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchProduct } from '@/lib/productAction'
import { fetchInvoiceProductBasedProduct } from '@/lib/invoiceProductAction'
import ActionButton from '@/components/ActionButton'

const Items = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data, isLoading } = useQuery({
    queryKey: ['Product'],
    queryFn: fetchProduct,
  })
  console.log('🚀 ~ Items ~ data:', data)

  function groupOptions(id: string) {
    return queryOptions({
      queryKey: ['Invoice_Product', id],
      queryFn: () => fetchInvoiceProductBasedProduct(id),
      staleTime: 5 * 1000,
    })
  }
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: invoiceProductData } = useQuery({
    ...groupOptions(selectedId ?? ''),
    enabled: !!selectedId,
  })

  const TotalQuantity = () => {
    const total = {
      qty: 0,
      purchase: 0,
      sale: 0,
      stockValue: 0,
    }
    if (!data) return total
    data.forEach((item) => {
      total.qty += item.opening_quantity ?? 0
    })
    data.forEach((item) => {
      total.sale += Number(item.sale_price ?? 0)
    })
    data.forEach((item) => {
      total.purchase += Number(item.purchase_price ?? 0)
    })
    total.stockValue = total.qty * total.sale
    return total
  }

  const [selectProduct, setSelectProduct] = useState<Product[]>()
  const [inputItem, setItemInput] = useState<Product>({
    id: '',
    name: '',
    hsn: '',
    unit: '',
    category: '',
    sub_category: '',
    opening_quantity: 0,
    purchase_price: 0,
    sale_price: 0,
    taxs: 18,
    location: '',
  })
  const [filterProduct, setFilterProduct] = useState('')
  const [filterTransaction, setFilterTransaction] = useState('')

  const open = (types: string, id: string) => {
    if (types === 'AdjustItems') {
      dispatch(
        openModal({
          type: types,
          index: id,
        })
      )
    } else {
      dispatch(
        openModal({
          type: types,
        })
      )
    }
  }
  useEffect(() => {
    if (data !== undefined && !isLoading) {
      console.log("🚀 ~ useEffect ~ data[0]:", data[0])
      setSelectProduct([
        {
          ...data[0],
          hsn: data[0].hsn ?? '',
          unit: data[0].unit ?? '',
          category: data[0].category ?? '',
          sub_category: data[0].sub_category ?? '',
          location: data[0].location ?? '',
          sale_price: Number(data[0].sale_price) ?? 0,
          purchase_price: Number(data[0].purchase_price) ?? 0,
          opening_quantity: data[0].opening_quantity ?? 0,
          taxs: data[0].taxs ?? 0,
          created_at: data[0].created_at ?? '',
        },
      ])
      setSelectedId(data[0].id)
    }
  }, [isLoading])

  const [sortOrder, setSortOrder] = useState('asc')

  // Function to filter and sort data
  const filterAndSortData = () => {
    if (!data) return []

    return data
      .filter(
        (item) =>
          item.name.toLowerCase().includes(filterProduct?.toLowerCase()) &&
          item?.category
            ?.toLowerCase()
            .includes(inputItem.category?.toLowerCase()) &&
          item?.sub_category
            ?.toLowerCase()
            .includes(inputItem.sub_category?.toLowerCase())
      )
      // .sort((a, b) => {
      //   const qtyA = a?.opening_quantity ?? 0
      //   const qtyB = b?.opening_quantity ?? 0
      //   return sortOrder === 'asc' ? qtyA - qtyB : qtyB - qtyA
      // })
  }

  return (
    <main className="w-full flex gap-3 h-full ">
      {!isLoading ? (
        <>
          <section className="bg-white shadow-lg  w-2/5 my-3 ml-3 p-3 space-y-3 ">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <FloatingInput
                  label="Search Products...."
                  className="w-full"
                  removeText={() => setFilterProduct('')}
                  type="text"
                  value={filterProduct}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFilterProduct(e.target.value)
                  }
                />
                <Button onClick={() => open('Items', '')}>
                  <Plus /> Add Item
                </Button>
              </div>
              <div className="flex flex-col   gap-1">
                <p className="font-semibold">Filter Products By Category :</p>
                <div className="flex gap-2 items-center">
                  <CategorySubcategorySelect
                    inputItem={inputItem}
                    setItemInput={setItemInput}
                  />
                  {inputItem.category !== '' && (
                    <X
                      className="text-gray-500 bg-gray-300 p-1 rounded-full"
                      onClick={() =>
                        setItemInput({
                          ...inputItem,
                          category: '',
                          sub_category: '',
                        })
                      }
                    />
                  )}
                </div> 

                {/* <Button
                  onClick={() =>
                    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                  }
                >
                  Sort by Quantity {sortOrder === 'asc' ? '↑' : '↓'}
                </Button> */}
              </div>
            </div>
            <div className="overflow-y-auto whitespace-nowrap">
              <Table className="h-full">
                <TableCaption>A list of your Products.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className=" ">
                  { filterAndSortData().map((item) => (
                      <Suspense fallback={'...Loading'} key={item.id}>
                        <TableRow
                          className=""
                          key={item.id}
                          onClick={() => {
                            setSelectedId(item.id)
                            setSelectProduct([
                              {
                                ...item,
                                hsn: item.hsn ?? '',
                                unit: item.unit ?? '',
                                category: item.category ?? '',
                                sub_category: item.sub_category ?? '',
                                location: item.location ?? '',
                                sale_price: Number(item.sale_price) ?? 0,
                                purchase_price:
                                  Number(item.purchase_price) ?? 0,
                                opening_quantity: item.opening_quantity ?? 0,
                                taxs: item.taxs ?? 0,
                                created_at: item.created_at ?? '',
                              },
                            ])
                          }}
                        >
                          <TableCell className="font-semibold">
                            {item.name.toUpperCase()}
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <span className="bg-neutral-100  text-gray-700 rounded-full px-2">
                              {item.category_product &&
                                item.category_product.title}
                            </span>
                            <span className="bg-neutral-100 text-gray-700 rounded-full px-2">
                              {item.sub_category_product &&
                                item.sub_category_product.title}
                            </span>
                          </TableCell>
                          <TableCell
                            className={`text-right  font-semibold ${
                              (item.opening_quantity ?? 0) > 10
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {item.opening_quantity}
                          </TableCell>
                          <TableCell className="text-right w-5">
                            <ActionButton type={'Items'} editData={item} />
                          </TableCell>
                        </TableRow>
                      </Suspense>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
          </section>
          <section className=" w-3/5 my-3 mr-3 flex flex-col gap-3">
            {/* ITEM DETAILS-------------------------------------------------------------------------------------------------- */}

            <div className=" bg-white shadow-lg h-1/5 w-full p-3 ">
              <div className="flex justify-between">
                <p className="text-lg font-semibold">
                  {selectProduct
                    ? selectProduct?.map((item) => item?.name.toUpperCase())
                    : 'Select Product / Total Product Details'}
                </p>
                {selectProduct && (
                  <Button
                    onClick={() => open('AdjustItems', selectProduct[0].id)}
                  >
                    <SlidersVertical />
                    Adjust Item
                  </Button>
                )}
              </div>
              <div className="flex justify-between  items-center">
                <div className="space-y-6">
                  <p className="text-base font-semibold text-gray-400">
                    SALE PRICE:{' '}
                    <span className="text-green-600">
                      {selectProduct
                        ? selectProduct?.map((item) =>
                            formatCurrencyINR(
                              typeof item?.sale_price === 'bigint'
                                ? item.sale_price.toString()
                                : item?.sale_price ?? 0
                            )
                          )
                        : formatCurrencyINR(TotalQuantity().sale)}
                    </span>
                  </p>
                  <p className="text-base font-semibold text-gray-400">
                    PURCHASE PRICE:{' '}
                    <span className="text-green-600">
                      {selectProduct
                        ? selectProduct?.map((item) =>
                            formatCurrencyINR(item.purchase_price.toString())
                          )
                        : formatCurrencyINR(TotalQuantity().purchase)}
                    </span>
                  </p>
                </div>
                <div className="space-y-6">
                  <p className="text-base font-semibold text-gray-400">
                    STOCK QUANTITY:{' '}
                    <span className="text-green-600">
                      {selectProduct
                        ? selectProduct?.map((item) =>
                            formatCurrencyINR(item?.opening_quantity ?? 0)
                          )
                        : formatCurrencyINR(TotalQuantity().qty)}{' '}
                    </span>
                  </p>
                  <p className="text-base font-semibold text-gray-400">
                    STOCK VALUE:{' '}
                    <span className="text-green-600">
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
                                {formatCurrencyINR(
                                  openingQuantity * salePriceValue
                                )}
                              </span>
                            )
                          })
                        : formatCurrencyINR(TotalQuantity().stockValue)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* TABLE INFORMATION---------------------------------------------------------------------------------------------- */}
            <div className=" bg-white shadow-lg p-3 h-full space-y-2">
              <div className="flex justify-between">
                <p className="text-lg font-semibold">TRANSACTION</p>
                <FloatingInput
                  label="Search by Name | Type"
                  type="text"
                  value={filterTransaction}
                  removeText={() => setFilterTransaction('')}
                  onChange={(e) => setFilterTransaction(e.target.value)}
                />
              </div>
              <div className=" overflow-y-scroll h-[67dvh]">
                <Table>
                  {/* <TableCaption>
                {transaction.length > 0
                  ? ' A list of your recent invoices.'
                  : 'Select Product to see invoices '}
              </TableCaption> */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[20px]">Sl.no</TableHead>
                      <TableHead className="">Type</TableHead>
                      <TableHead className="w-24">Invoice no.</TableHead>
                      <TableHead className="w-24">Date</TableHead>
                      <TableHead className="w-24">Shade no.</TableHead>
                      <TableHead className="w-24">Quantity</TableHead>
                      <TableHead className="text-right w-24">
                        Price/Unit
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <>
                      {invoiceProductData &&
                        invoiceProductData
                          .filter((item) =>
                            item?.invoice?.invoice_type
                              ?.toLowerCase()
                              .includes(filterTransaction.toLowerCase())
                          )
                          .map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell className="">{index + 1}</TableCell>
                              <TableCell className="">
                                {item.invoice?.invoice_type?.toLocaleUpperCase()}
                              </TableCell>
                              <TableCell className="">
                                {item.invoice?.invoice_no}
                              </TableCell>

                              <TableCell className="w-24">
                                {formatDate(item.invoice?.invoice_date)}
                              </TableCell>
                              <TableCell className="w-24">
                                {item?.description}
                              </TableCell>
                              <TableCell className="">{item.qty}</TableCell>
                              <TableCell className="text-right text-green-600 w-24">
                                {formatCurrencyINR(
                                  item.price_per_unit.toString()
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                    </>
                  </TableBody>
                </Table>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <div className="bg-muted w-full h-full  flex items-center justify-center">
            <LoaderCircle className="animate-spin" color="blue" />
          </div>
        </>
      )}
    </main>
  )
}

export default Items
