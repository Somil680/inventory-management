'use client'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { openModal } from '@/redux/slices/modal'
import { MenuSquare, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
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
import type { Party } from '@/lib/type'
import { formatDate } from '@/hooks/hook'
import { setupPartyRealtime } from '@/redux/slices/PartyData'
interface TransactionData {
  bill_amount: number // Add bill_amount property
  invoice_type: string // Add invoice_type property
  invoice_date: string // Add invoice_date property
  invoice_no: string // Add invoice_no property
}
const Party = () => {
  const [productData, setProductData] = useState<Party[]>([])
  console.log('🚀 ~ Party ~ productData:', [productData])
  const [selectProduct, setSelectProduct] = useState<Party[]>()
  console.log('🚀 ~ Items ~ selectProduct:', selectProduct)
  //  console.log('🚀 ~ Items ~ selectProduct:', typeof selectProduct)
  //
  async function fetchParties() {
    const { data, error } = await supabase.from('party').select() // Select all columns
    if (error) {
      console.error('Error fetching data:', error)
      return null // Or throw the error, depending on your needs
    }
    console.log('🚀 ~ fetchAllFromTable ~ data:', data)

    return setProductData(data)
  }
  // const [getData, setGetData] = useState<Invoice[]>([])
  
  // const getSaleData = async (id: string) => {
  //   const { data, error } = await supabase
  //     .from('sale')
  //     .select()
  //     .eq('customer_id', id) // Insert an array of objects

  //   if (error) {
  //     console.error('Error inserting data:', error)
  //     return null
  //   }

  //   console.log('🚀 ~ insertData ~ data:', data)
  //   return setGetData(data)
  // }

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
  const [transaction, setTransaction] = useState<TransactionData[]>([])
  console.log('🚀 ~ Items ~ transaction:', transaction)
  const getTransactionData = async (id: string): Promise<TransactionData[]> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`*`)
        .eq('party_id', id)
      if (error) {
        throw error
      }

      setTransaction(data)
      return data

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
        type: 'Party',
      })
    )
    console.log('🚀 ~ open ~ open:')
  }
   useEffect(() => {
     fetchParties()

     const unsubscribe = setupPartyRealtime(dispatch) // Set up real-time listener

     return () => {
       unsubscribe() // Unsubscribe when the component unmounts
     }
   }, [dispatch])



  const handleGetData = (item: Party) => {
    // getSaleData(item.id)
    setSelectProduct([item])
  }

  return (
    <main className="w-full flex gap-3 h-[93vh] ">
      <section className="bg-white shadow-lg w-1/4 my-3 ml-3 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <FloatingInput label="Search" type="text" />
          <MenuSquare />
        </div>
        <div className="flex justify-end">
          <Button onClick={() => open()}>
            <Plus /> Add Party
          </Button>
        </div>
        <div>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">PARTY</TableHead>
                <TableHead className="text-right">AMOUNT</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData.map((item) => (
                <TableRow
                  key={item?.id}
                  onClick={() => {
                    handleGetData(item)
                    getTransactionData(item.id)
                  }}
                >
                  <TableCell className="font-medium">{item?.name}</TableCell>
                  <TableCell className="text-right">
                    {item?.opening_balance}
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
      <section className=" w-3/4 my-3 mr-3 flex flex-col gap-3">
        {/* ITEM DETAILS-------------------------------------------------------------------------------------------------- */}
        <div className=" bg-white shadow-lg h-1/5 w-full p-3 ">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">
              {selectProduct
                ? selectProduct?.map((item) => item?.name)
                : 'Select Product'}
            </p>
            <Button >
              {/* <SlidersVertical /> */}
              Whatsapp
            </Button>
          </div>
          <div className="flex justify-between space-y-6 items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-400">
                Phone:
                {selectProduct
                  ? selectProduct?.map((item) => item?.contact)
                  : 'null'}
              </p>
              <p className="text-sm font-semibold text-gray-400">
                Email:{' '}
                {selectProduct
                  ? selectProduct?.map((item) => item?.email)
                  : 'null'}{' '}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-400">
                GST no.:{' '}
                {selectProduct
                  ? selectProduct?.map((item) => item?.gstIn)
                  : 'null'}{' '}
              </p>
              <p className="text-sm font-semibold text-gray-400">
                Address:{' '}
                {selectProduct
                  ? selectProduct?.map((item) => item?.address)
                  : 'null'}{' '}
              </p>
            </div>
          </div>
        </div>

        {/* TABLE INFORMATION---------------------------------------------------------------------------------------------- */}
        <div className=" bg-white shadow-lg p-3 h-full space-y-2">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">TRANSACTION</p>
            <FloatingInput label="Search" type="text" />
          </div>
          <div>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[100px]">Invoice no.</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction.map((item) => (
                  <>
                    <TableRow>
                      <TableCell className="w-[100px]">
                        {item.invoice_type}
                      </TableCell>
                      <TableCell className="w-[100px]">
                        {item.invoice_no}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatDate(item.invoice_date)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.bill_amount}
                      </TableCell>
                    </TableRow>
                  </>
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
        </div>
      </section>
    </main>
  )
}

export default Party
