'use client'
import React, { useState } from 'react'
import FloatingInput from '@/components/ui/floating-input'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { Button } from '@/components/ui/button'
import { formatDates } from '@/hooks/hook'
import { Invoice, InvoiceProducts } from '@/lib/type'
import TableSale from '@/components/Table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { v4 as uuidv4 } from 'uuid'

import { toast } from 'sonner'
import { clearSaleItemsOnSubmit } from '@/redux/slices/saleItem'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createInvoice } from '@/lib/invoiceAction'
import { createInvoiceProduct } from '@/lib/invoiceProductAction'
import { fetchBankAccount } from '@/lib/paymentAction'
import { fetchParty } from '@/lib/client'
import { Switch } from '../ui/switch'
interface InvoiceBillProps {
  invoiceType: string
  gstType: string
  switchBtn: boolean
}
interface PartyDetails {
  name: string
  contact?: bigint | null
  id: string
}
const InvoiceBill: React.FC<InvoiceBillProps> = ({
  invoiceType,
  gstType,
  switchBtn,
}) => {
  const dispatch: AppDispatch = useDispatch()

  const saleItemsData = useSelector((state: RootState) => state.saleItems) // Get saleItems from Redux
  const [partyDropdownOpen, setPartyDropdownOpen] = useState(false)
  const [invoice, setInvoice] = useState<Invoice>({
    id: '',
    invoice_no: '8',
    invoice_date: new Date(),
    invoice_type: null,
    party_id: null,
    bill_amount: 0,
    payment_type: '',
    discount_on_amount: 0,
    billing_name: '',
  })
  const [partyDetail, setPartyDetails] = useState({
    party_name: '',
    phone: '',
  })
  const [invoiceTypeSwitch, setInvoiceTypeSwitch] = useState('cash')
  console.log('🚀 ~ invoice__Type:', invoiceTypeSwitch)

  const handleSubmitTypeChange = (checked: boolean) => {
    setInvoiceTypeSwitch(checked ? 'cash' : 'credit')
  }
  const { data: paymentType } = useQuery({
    queryKey: ['Payment'],
    queryFn: fetchBankAccount,
  })
  const { data: party, isLoading } = useQuery({
    queryKey: ['Party'],
    queryFn: fetchParty,
  })

  const handleInvoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }))
  }

  const handlePartySelect = (selectedParty: PartyDetails) => {
    setPartyDetails((prev) => ({
      ...prev,
      party_name: selectedParty.name,
      phone: selectedParty.contact ? selectedParty.contact.toString() : '',
    }))
    setInvoice((prev) => ({
      ...prev,
      party_id: selectedParty.id,
      billing_name: partyDetail?.party_name,
    }))
    setPartyDropdownOpen(false) // Close the dropdown
  }
  const queryClient = useQueryClient()
  const invoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Party'] })
        queryClient.invalidateQueries({ queryKey: ['Product'] })
        toast.success('Invoice created successfully')
      console.log('invoice success')
    },
    onError: (error) => {
      toast.error('Error on Creating Invoice ')
      console.log('invoice error', error)
    },
  })

  const invoiceProductMutation = useMutation({
    mutationFn: createInvoiceProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Product'] })
      console.log('invoice success product')
    },
    onError: (error) => {
      console.log('invoice error product', error)
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const invoiceId = uuidv4()
      const updatedInvoice = {
        ...invoice,
        id: invoiceId,
        party_id:   invoice.party_id === '' ? null : invoice.party_id ,
        invoice_type:
          invoiceType === 'cash'
            ? invoiceTypeSwitch
            : (invoiceType as
                | 'cash'
                | 'purchase'
                | 'sale_return'
                | 'purchase_return'
                | 'add_stock'
                | 'reduce_stock'
                | 'payment_in'
                | 'payment_out'
                | 'credit'
                | null),
        billing_name: invoice.billing_name || partyDetail.party_name,
        bill_amount: saleItemsData.bill_amount,
      }
      console.log('🚀 ~ handleSubmit ~ updatedInvoice----------:', updatedInvoice)
      invoiceMutation.mutate({
        ...updatedInvoice,
        invoice_type: updatedInvoice.invoice_type as
          | 'cash'
          | 'credit'
          | 'purchase'
          | 'add_stock'
          | 'reduce_stock'
          | 'sale_return'
          | 'purchase_return'
          | 'payment_in'
          | 'payment_out'
          | null,
      })
      const saleProductsToInsert: InvoiceProducts[] = saleItemsData.saleItems
        .filter((item) => item.id !== '')
        .map((saleItem) => ({
          id: uuidv4(),
          invoice_id: invoiceId,
          product_id: saleItem.productId,
          qty: saleItem.qty ?? 0,
          description: saleItem.description ?? '',
          rate: saleItem.rate ?? 0,
          price_per_unit: saleItem.price_per_unit ?? 0,
          amount: saleItem.amount ?? 0,
        }))

      if (saleProductsToInsert.length > 0) {
        invoiceProductMutation.mutate(saleProductsToInsert)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred')
      }
      console.log('🚀 ~ handleSubmit ~ error:', error)
    }
    setPartyDetails({
      party_name: '',
      phone: '',
    })
    setInvoice({
      id: '',
      billing_name: '',
      invoice_no: '',
      invoice_date: new Date(),
      invoice_type: null,
      party_id: '',
      bill_amount: 0,
      payment_type: '',
      discount_on_amount: 0,
    })
    dispatch(clearSaleItemsOnSubmit())
  }

  return (
    <div className="h-full  ">
      <form
        className="w-full h-full flex flex-col justify-between "
        onSubmit={handleSubmit}
      >
        <div>
          <div className="flex justify-between items-end p-10">
            <div className="flex flex-col gap-3 justify-end h-full">
              {switchBtn && (
                <div className="flex items-center space-x-2 ">
                  <label htmlFor="customer-type" className="font-semibold ">
                    Credit
                  </label>
                  <Switch
                    id="customer-type"
                    checked={invoiceTypeSwitch === 'cash'}
                    onCheckedChange={handleSubmitTypeChange}
                  />
                  <label htmlFor="customer-type" className="font-semibold ">
                    Cash
                  </label>
                </div>
              )}
              <div className="flex gap-2">
                <div className="p-0  relative ">
                  {(invoiceTypeSwitch !== 'cash' ||
                    invoiceType === 'purchase' ||
                    invoiceType === 'purchase_return') && (
                    <FloatingInput
                      label={`Party Name *`}
                      className=" "
                      type="text"
                      name="party_name"
                      required={invoice.invoice_type === 'credit'}
                      value={partyDetail.party_name}
                      onChange={(e) =>
                        setPartyDetails((prev) => ({
                          ...prev,
                          party_name: e.target.value,
                        }))
                      }
                      onClick={() => setPartyDropdownOpen(true)}
                    />
                  )}
                  {partyDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 rounded-md py-2 shadow-sm bg-neutral-50 z-50 w-full border-2 border-blue-200">
                      <table className="w-full leading-7 ">
                        <tr className="border-b w-full">
                          <th className="flex justify-between items-center px-3">
                            Name
                          </th>
                        </tr>

                        {!isLoading ? (
                          party &&
                          party.filter((items) =>
                            items.name
                              .toLowerCase()
                              .includes(partyDetail.party_name.toLowerCase())
                          ).length > 0 ? (
                            party
                              .filter((items) =>
                                items.name
                                  .toLowerCase()
                                  .includes(
                                    partyDetail.party_name.toLowerCase()
                                  )
                              )
                              .map((item) => (
                                <tr key={item.id}>
                                  <td
                                    onClick={() => {
                                      handlePartySelect(item)
                                      setPartyDropdownOpen(false)
                                    }}
                                    className=" px-3 cursor-pointer hover:bg-blue-100  hover:rounded-full "
                                  >
                                    {' '}
                                    {item.name}
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <div className="flex justify-between items-center">
                              <p className=" ">
                                Add{' '}
                                <span className="text-blue-600 font-semibold">
                                  `{partyDetail.party_name}`
                                </span>
                                to the Party{' '}
                              </p>
                              <Button size={'sm'}>Add</Button>
                            </div>
                          )
                        ) : (
                          <p>Loading...</p>
                        )}
                      </table>
                    </div>
                  )}
                </div>
                <FloatingInput
                  label="Billing Name"
                  className=" "
                  type="text"
                  name="billing_name"
                  value={invoice.billing_name || partyDetail?.party_name}
                  onChange={handleInvoiceChange}
                />

                <FloatingInput
                  label="Phone"
                  name="phone"
                  type="number"
                  value={partyDetail.phone ?? ''}
                  onChange={handleInvoiceChange}
                />
              </div>
            </div>
            <div className="gap-3 flex flex-col">
              <FloatingInput
                required
                label="Invoice No."
                name="invoice_no"
                value={invoice.invoice_no}
                type="number"
                onChange={handleInvoiceChange}
              />
              <FloatingInput
                required
                label="Invoice Date"
                name="invoice_date"
                value={formatDates(new Date(invoice.invoice_date))}
                readOnly
                type="date"
                onChange={handleInvoiceChange}
              />
            </div>
          </div>
          <div className="  border ">
            <TableSale type={gstType} />
          </div>
          <div className="flex flex-col gap-4 items-end p-20">
            <div className="flex gap-3 items-center ">
              <p>Payment Type</p>
              <Select
                required
                onValueChange={(value) =>
                  setInvoice((prev) => ({
                    ...prev,
                    payment_type: value,
                  }))
                }
                value={invoice.payment_type ?? undefined}
              >
                <SelectTrigger id="payment" className="w-56">
                  <SelectValue placeholder="Select Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  {paymentType?.map((item) => (
                    <>
                      <SelectItem key={item.id} value={item.id}>
                        {item.account_name}
                      </SelectItem>
                    </>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="h-20 shadow-inner w-full bg-white flex items-center justify-end p-4 space-x-3">
          <Button className="h-10 w-40">Save</Button>
        </div>
      </form>
    </div>
  )
}

export default InvoiceBill

// import React from 'react'

// const Invoice = () => {
//   return (
//     <main className="w-full border-2 mx-auto p-6  rounded-lg shadow-lg bg-white text-sm">
//       <div className="border-4  flex w-full">
//         <section className="w-1/2 border-red-400 border">
//           <div className="border-2">
//             <p>Company Name</p>
//             <p>Company Address</p>
//             <p> GSTIN : 23AFWPA0998L1ZX</p>
//             <p> GSTIN/UIN: 23AFWPA0998L1ZX</p>
//             <p> State Name : Madhya Pradesh, Code : 23</p>
//             <p> E-Mail : tinkalagrawal82@gmail.com</p>
//           </div>
//           <div className="border-2">
//             {' '}
//             <p> Consignee (Ship to)</p>
//             <p>Company Name Shri Hanumanta Constrction Guna</p>
//             <p> GSTIN : 23AFWPA0998L1ZX</p>
//             <p> State Name : Madhya Pradesh, Code : 23</p>
//           </div>
//           <div className="border-2">
//             {' '}
//             <p> Buyer (Bill to)</p>
//             <p>Company Name Shri Hanumanta Constrction Guna</p>
//             <p> GSTIN : 23AFWPA0998L1ZX</p>
//             <p> State Name : Madhya Pradesh, Code : 23</p>
//           </div>
//         </section>
//         <section className="w-1/2 border-green-400 border">
//           <div className="flex w-full ">
//             <div className="border w-1/2"> Invoice No.</div>
//             <div className="border w-1/2">Invoice Date</div>
//           </div>
//           <div className="flex w-full ">
//             <div className="border w-1/2"> Invoice No.</div>
//             <div className="border w-1/2">Invoice Date</div>
//           </div>
//           <div className="flex w-full ">
//             <div className="border w-1/2"> Invoice No.</div>
//             <div className="border w-1/2">Invoice Date</div>
//           </div>
//           <div className="flex w-full ">
//             <div className="border w-1/2"> Invoice No.</div>
//             <div className="border w-1/2">Invoice Date</div>
//           </div>
//           <div className="flex w-full ">
//             <div className="border w-1/2"> Invoice No.</div>
//             <div className="border w-1/2">Invoice Date</div>
//           </div>
//           <div className="flex w-full ">
//             <div className="border w-1/2"> Invoice No.</div>
//             <div className="border w-1/2">Invoice Date</div>
//           </div>
//           <div className="flex w-full border ">Term of Dilivery</div>
//         </section>
//         <section></section>
//       </div>
//       <table className="w-full border-collapse border mb-4 text-xs">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Sl. No.</th>
//             <th className="border p-2">Description of Goods</th>
//             <th className="border p-2">HSN/SAC</th>
//             <th className="border p-2">Quantity</th>
//             <th className="border p-2">Rate (incl of tax)</th>
//             <th className="border p-2">Rate</th>
//             <th className="border p-2">per</th>
//             <th className="border p-2">Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td className="border p-2">1</td>
//             <td className="border p-2">Sample Product</td>
//             <td className="border p-2">1234</td>
//             <td className="border p-2">10</td>
//             <td className="border p-2">10</td>
//             <td className="border p-2">10</td>
//             <td className="border p-2">100</td>
//             <td className="border p-2">1000</td>
//           </tr>
//         </tbody>
//         <tfoot>
//           <tr>
//             <td className="border p-2 text-right" colSpan={2}>
//               OutPut cGst{' '}
//             </td>
//             <td className=" p-2" colSpan={5}></td>
//             <td className="border p-2">1000</td>
//           </tr>
//           <tr>
//             <td className="border p-2 text-right" colSpan={2}>
//               OutPut SGst{' '}
//             </td>
//             <td className=" p-2" colSpan={5}></td>
//             <td className="border p-2">1000</td>
//           </tr>
//           <tr>
//             <td className="border p-2 text-right" colSpan={2}>
//               Total{' '}
//             </td>
//             <td className=" p-2" colSpan={5}></td>
//             <td className="border p-2">1000</td>
//           </tr>

//         </tfoot>
//       </table>

//       {/* Header Section
//       <div className="flex justify-between items-center border-b pb-4 mb-4">
//         <div>
//           <h1 className="text-2xl font-bold">+ Add Business Logo</h1>
//           <h2 className="text-lg font-semibold">Company's Name</h2>
//           <p className="text-sm">Address</p>
//         </div>
//         <div className="text-right">
//           <p className="text-sm">Invoice No:</p>
//           <p className="text-sm">Dated:</p>
//         </div>
//       </div>

//       {/* Buyer & Consignee */}
//       {/* <div className="grid grid-cols-2 gap-4 mb-4">
//         <div>
//           <h2 className="text-lg font-semibold">Buyer (Bill to)</h2>
//           <p>Company's Name</p>
//           <p>Address</p>
//           <p>GSTIN/UIN:</p>
//           <p>State: ________ Pin code: ________</p>
//         </div>
//         <div>
//           <h2 className="text-lg font-semibold">Consignee (Ship to)</h2>
//           <p>Company's Name</p>
//           <p>Address</p>
//           <p>GSTIN/UIN:</p>
//           <p>State: ________ Pin code: ________</p>
//         </div>
//       </div> */}

//       {/* Table for Items

//       Tax Details
//       <table className="w-full border-collapse border mb-4 text-xs">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">HSN/SAC</th>
//             <th className="border p-2">Taxable Amount</th>
//             <th className="border p-2">CGST Rate</th>
//             <th className="border p-2">CGST Amount</th>
//             <th className="border p-2">SGST Rate</th>
//             <th className="border p-2">SGST Amount</th>
//             <th className="border p-2">Total Tax</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td className="border p-2">1234</td>
//             <td className="border p-2">1000</td>
//             <td className="border p-2">5%</td>
//             <td className="border p-2">50</td>
//             <td className="border p-2">5%</td>
//             <td className="border p-2">50</td>
//             <td className="border p-2">100</td>
//           </tr>
//         </tbody>
//       </table>

//       Total & Declaration
//       <div className="border-t pt-4">
//         <p className="text-sm font-semibold">Total Amount: ₹1100</p>
//         <p className="text-sm font-semibold">
//           Amount Chargeable (in words): One Thousand One Hundred Rupees Only
//         </p>
//         <p className="text-xs italic mt-4">
//           We declare that this invoice shows the actual price of the goods
//           described and that all particulars are true and correct.
//         </p>
//       </div>

//       Signature
//       <div className="text-right mt-4">
//         <p className="text-sm font-semibold">Customer's Seal and Signature</p>
//         <p className="text-sm font-semibold">Authorised Signatory</p>
//       </div> */}
//     </main>
//   )
// }

// export default Invoice
