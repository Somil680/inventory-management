'use client'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
import { openModal } from '@/redux/slices/modal'
import {
  EllipsisVertical,
  IndianRupee,
  LoaderCircle,
  MoveDownLeft,
  MoveUpRight,
  Plus,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Party, Party as PartyPage } from '@/lib/type'
import { formatCurrencyINR, formatDate } from '@/hooks/hook'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { AppDispatch } from '@/redux/store'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchParty } from '@/lib/client'
import { fetchInvoiceBasedOnParty } from '@/lib/invoiceAction'
import ActionButton from '@/components/ActionButton'

const PartyPage = () => {
  const { data ,isLoading } = useQuery({
    queryKey: ['Party'],
    queryFn: fetchParty,
  })
  console.log('🚀 ~ PartyPage ~ data:', typeof window !== 'undefined')

  function groupOptions(id: string) {
    return queryOptions({
      queryKey: ['Invoice', id],
      queryFn: () => fetchInvoiceBasedOnParty(id),
      // staleTime: 5 * 1000,
    })
  }
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: invoiceData } = useQuery({
    ...groupOptions(selectedId ?? ''),
    enabled: !!selectedId,
  })

  const [filterTransaction, setFilterTransaction] = useState('')
  const [selectProduct, setSelectProduct] = useState<Party[]>()

  const dispatch = useDispatch<AppDispatch>()

  const open = (types: string, id: string) => {
    if (types === 'PaymentIn') {
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

  const handleGetData = (item: PartyPage) => {
    // getSaleData(item.id)
    setSelectProduct([item])
  }
  const [searchInput, setSearchInput] = useState('')
  // const totalSale = transaction.reduce(
  //   (sum, item) =>
  //     sum +
  //     (item.invoice_type !== 'purchase' ? item.bill_amount ?? 0 : 0) -
  //     (item.invoice_type === 'purchase' ? item.bill_amount ?? 0 : 0),
  //   0
  // )
  useEffect(() => {

    if(!data)return
    setSelectProduct([data[0]])
    
  },[isLoading])
  return (
    <main className="w-full flex gap-3 h-full ">
      {!isLoading ? <>
      <section className="bg-white shadow-lg w-2/5 my-3 ml-3 p-3 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <FloatingInput
            label="Search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full"
            removeText={() => setSearchInput('')}
          />
          <Button onClick={() => open('Party', '')}>
            <Plus /> Add Party
          </Button>
        </div>
        <div className="flex">Filter Party</div>
        <div>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="">PARTY</TableHead>
                <TableHead className="text-right">AMOUNT</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data
                  .filter(
                    (item) =>
                      item.name
                        .toLowerCase()
                        .includes(searchInput.toLowerCase()) &&
                      item.name.toLowerCase() !== 'cash sale'
                  )
                  .map((item) => (
                    <TableRow
                      key={item?.id}
                      onClick={() => {
                        handleGetData(item)
                        setSelectedId(item.id)
                      }}
                      className={
                        selectProduct?.[0]?.id === item.id
                          ? ' bg-[#f3f4f780]'
                          : ''
                      }
                    >
                      <TableCell className="font-medium">
                        {item?.name.toUpperCase()}
                      </TableCell>
                      <TableCell
                        className={` 
                      ${
                        Number(item?.receive_amount) -
                          Number(item?.pay_amount) >=
                        0
                          ? 'text-green-600 text-right font-semibold flex items-center justify-end'
                          : 'text-red-600 text-right font-semibold flex items-center justify-end'
                      }
                    `}
                      >
                        {formatCurrencyINR(
                          Number(item?.receive_amount) -
                            Number(item?.pay_amount)
                        )}
                        {Number(item?.receive_amount) -
                          Number(item?.pay_amount) >=
                        0 ? (
                          <MoveUpRight size={15} />
                        ) : (
                          <MoveDownLeft size={15} />
                        )}
                      </TableCell>
                      <TableCell className="text-right w-5">
                       <ActionButton type='Party' editData={item}/>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </section>
      <section className=" w-3/5 my-3 mr-3 flex flex-col gap-3">
        <div className=" bg-white shadow-lg h-1/5 w-full p-3 ">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">
              {selectProduct
                ? selectProduct?.map((item) => item?.name.toUpperCase())
                : 'Select Party'}
            </p>

            {selectProduct && (
              <div className=" flex gap-2">
                <Button onClick={() => open('PaymentIn', selectProduct[0].id)}>
                  <IndianRupee />
                  Take Payment
                </Button>

                <Popover>
                  <PopoverTrigger>
                    <EllipsisVertical size={20} color="gray" />
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col p-2 ">
                    Make this party{' '}
                    <Button variant={'outline'}>Inactive</Button>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          <div className="flex flex-col  ">
            <div className="flex justify-between space-y-4">
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
            <div className=" space-y-4">
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

        <div className=" bg-white shadow-lg p-3 h-full space-y-2">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">TRANSACTION</p>
            <FloatingInput
              label="Search by Type"
              type="text"
              value={filterTransaction}
              onChange={(e) => setFilterTransaction(e.target.value)}
              removeText={() => setFilterTransaction('')}
            />
          </div>
          <div className=" overflow-y-scroll h-[67dvh]">
            <Table>
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader className="sticky top-0 z-40 bg-white  ">
                <TableRow>
                  <TableHead className="w-[30px]">Sl.No.</TableHead>
                  <TableHead className="">Type</TableHead>
                  <TableHead className="w-24">Invoice no.</TableHead>
                  <TableHead className="text-right w-24">Date</TableHead>
                  <TableHead className="text-right w-24">Total</TableHead>
                  <TableHead className="text-right "></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData &&
                  invoiceData
                    .filter((item) =>
                      item?.invoice_type
                        ?.toLowerCase()
                        .includes(filterTransaction.toLowerCase())
                    )
                    .map((item, index) => (
                      <TableRow key={item?.id}>
                        <TableCell className="">{index + 1}</TableCell>
                        <TableCell className="">
                          {item?.invoice_type?.toUpperCase()}
                        </TableCell>
                        <TableCell className="w-24">
                          {item.invoice_no}
                        </TableCell>
                        <TableCell className="text-right w-24">
                          {formatDate(item?.invoice_date)}
                        </TableCell>
                        <TableCell
                          className={
                            item.invoice_type === 'purchase'
                              ? 'text-red-600 font-semibold text-right'
                              : 'text-green-600 font-semibold text-right'
                          }
                        >
                          {formatCurrencyINR(item?.bill_amount ?? 0)}
                        </TableCell>
                        <TableCell className='text-right w-5'>

                        <Popover>
                          <PopoverTrigger>
                            <EllipsisVertical size={20} color="gray" />
                          </PopoverTrigger>
                          <PopoverContent className="flex flex-col p-2 w-24">
                            <Button variant={'link'}>View / Edit</Button>
                            <Button variant={'link'}>Delete</Button>
                          </PopoverContent>
                        </Popover>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
              {invoiceData && (
                <>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell
                        className={`  gap-2 w-[200px]
                      ${
                        Number(selectProduct?.[0]?.receive_amount ?? 0) -
                          Number(selectProduct?.[0]?.pay_amount ?? 0) >=
                        0
                          ? 'text-green-600 font-semibold text-right'
                          : 'text-red-600 font-semibold text-right'
                      } `}
                      >
                        <span>
                          {Number(selectProduct?.[0]?.receive_amount ?? 0) -
                            Number(selectProduct?.[0]?.pay_amount ?? 0) >=
                          0
                            ? 'You will get this'
                            : 'You will pay this'}
                        </span>
                      </TableCell>
                      <TableCell
                        className={` 
                      ${
                        Number(selectProduct?.[0]?.receive_amount ?? 0) -
                          Number(selectProduct?.[0]?.pay_amount ?? 0) >=
                        0
                          ? 'text-green-600 text-right font-semibold flex items-center justify-end'
                          : 'text-red-600 text-right font-semibold flex items-center justify-end'
                      }
                    `}
                      >
                        {formatCurrencyINR(
                          Number(selectProduct?.[0]?.receive_amount ?? 0) -
                            Number(selectProduct?.[0]?.pay_amount ?? 0)
                        )}
                      </TableCell>
                      
                    </TableRow>
                  </TableFooter>
                </>
              )}
            </Table>
          </div>
        </div>
      </section>
        
      </> :
      <>
                 <div className='bg-muted w-full h-full  flex items-center justify-center'>
                   <LoaderCircle className='animate-spin' color='blue'/>
                 </div>
             </>
      }
    </main>
  )
}

export default PartyPage


