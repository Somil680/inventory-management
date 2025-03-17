'use client'
import React, { useEffect, useState } from 'react'
import FloatingInput from '@/components/ui/floating-input'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { fetchItems } from '@/redux/slices/ItemData'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {  formatDates } from '@/hooks/hook'
import { Invoice, Party } from '@/lib/type'
import { fetchParty } from '@/redux/slices/PartyData'
import TableSale from '@/components/Table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// import saveInvoiceAndSaleProducts from '@/hooks/save'
import { fetchInvoices, setupInvoiceRealtime } from '@/redux/slices/InvoiceData'
import saveInvoiceAndSaleProducts from '@/hooks/save'

const SaleInputTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const saleItemsData = useSelector((state: RootState) => state.saleItems) // Get saleItems from Redux
  const { party, loading, error } = useSelector(
    (state: RootState) => state.party
  )
  const { invoices} = useSelector(
    (state: RootState) => state.invoices
  )
  console.log("🚀 ~ invoices:", invoices)
   const [invoice, setInvoice] = useState<Invoice>({
     invoice_no:  (invoices.length+1).toString(),
     invoice_date: new Date(),
     invoice_type: 'cash',
     party_id: '',
     bill_amount: 0,
     payment_type: null,
     discount_on_amount: 0,
   })
   console.log("🚀 ~ invoice:", invoice)
  
  
  
  const [partyDropdownOpen, setPartyDropdownOpen] = useState(false)
  const handlePartyDropdownToggle = () => {
    setPartyDropdownOpen(true)
  }


  const handleInvoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }))
  }
  const [partyDetail, setPartyDetails] = useState({
    party_name: '',
    phone: '',
  })

  const handlePartySelect = (selectedParty: Party) => {
     setInvoice((prev) => ({
       ...prev,
       party_id: selectedParty.id,
     }))
     setPartyDetails((prev) => ({
       ...prev,
       party_name: selectedParty.name,
       phone: selectedParty.contact ? selectedParty.contact.toString() : '',
     }))
     setPartyDropdownOpen(false) // Close the dropdown
   }


  const handleInvoiceTypeChange = (value: boolean | string) => {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      invoice_type: value ? 'cash' : 'credit', // Update payment_type based on switch value
    }))
  }


  const handlePaymentTypeChange = (value: 'Cash' | 'Online' | 'RTGS') => {
      // setCustomerType(value)
      setInvoice((prev) => ({ ...prev, payment_type: value }))
    }



  const handleSubmit = async () => {
    try {
      const updatedInvoice = {
        // Create a temporary variable
        ...invoice,
        bill_amount: parseFloat(
          (
            saleItemsData.bill_amount +
            (saleItemsData.bill_amount * 18) / 100
          ).toFixed(2)
        ),
      }
      console.log("🚀 ~ handleSubmit ~ saleItemsData:", saleItemsData)
      console.log("🚀 ~ handleSubmit ~ updatedInvoice:", updatedInvoice)
      const isSave = await saveInvoiceAndSaleProducts({
        invoice: updatedInvoice, // Pass the updated invoice
        saleItemsData,

      })
      if (isSave) {
        console.log('🚀 ~ handleSubmit ~ isSave:', isSave)
        // Do your stuff after successful save
      } else {
        // Do your stuff on error
      }
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
    }
  }

useEffect(() => {
  if (invoices.length > 0) {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      invoice_no: (invoices.length + 1).toString(),
    }))
  }
}, [invoices]) 
  useEffect(() => {
    dispatch(fetchInvoices())
    dispatch(fetchItems()) // Fetch items with category filter
    dispatch(fetchParty()) // Fetch items with category filter
       const unsubscribe = setupInvoiceRealtime(dispatch) // Set up real-time
       return () => unsubscribe() // Clean up subscription
     }, [dispatch])

  return (
    <div className=" h-[93vh] flex flex-col justify-between">
      <form className="w-full ">
        <div className="flex bg-white items-center gap-4 px-4 shadow-lg">
          <h1 className="text-2xl font-bold">Sales</h1>
          <div className="flex items-center space-x-2">
            <p>Customer Type:</p>
            <Switch
              id="customer-type"
              checked={invoice.invoice_type === 'cash'}
              onCheckedChange={handleInvoiceTypeChange}
            />
            <label htmlFor="customer-type">
              {invoice.invoice_type === 'credit' ? 'Credit' : 'Cash'}
            </label>
          </div>
        </div>
        <div className="bg-[#f3f3f3">
          <div className="flex justify-between items-start p-10">
            <div className="flex gap-2">
              <div
                className="p-0 border relative "
                style={{ position: 'relative' }}
              >
                <FloatingInput
                  label="Party Name"
                  className=" w-full h-9 p-3 "
                  type="text"
                  name="party_name"
                  value={partyDetail.party_name}
                  onChange={handleInvoiceChange}
                  onClick={() => handlePartyDropdownToggle()}
                />

                {!loading
                  ? partyDropdownOpen && (
                      <div className="absolute top-full left-0 rounded-sm p-2 shadow-sm bg-neutral-50 z-50 w-full">
                        <table className="w-full leading-7">
                          <tr className="border-b w-full">
                            <th className="text-left">Item </th>
                            {/* <th>Quantity</th> */}
                          </tr>

                          {party
                            .filter((items) =>
                              items.name
                                .toLowerCase()
                                .includes(partyDetail.party_name.toLowerCase())
                            )
                            .map((item) => (
                              <tr
                                key={item.id}
                                onClick={() => handlePartySelect(item)}
                                className="p-1 cursor-pointer hover:bg-neutral-100 "
                              >
                                <td> {item.name}</td>
                                <td className="text-center">
                                  {item.opening_balance}
                                </td>
                              </tr>
                            ))}
                        </table>
                      </div>
                    )
                  : error
                  ? error
                  : '..loading'}
              </div>

              <FloatingInput
                label="Phone"
                name="phone"
                type="number"
                value={partyDetail.phone ?? ''}
                // onChange={handleInvoiceChange}
              />
            </div>
            <div className="gap-2 flex flex-col">
              <FloatingInput
                label="Invoice No."
                name="invoice_no"
                value={invoice.invoice_no}
                
                type="number"
                onChange={handleInvoiceChange}
              />
              <FloatingInput
                label="Invoice Date"
                name="invoice_date"
                value={formatDates(invoice.invoice_date)}
                readOnly
                type="date"
                onChange={handleInvoiceChange}
              />
            </div>
          </div>
          <div className="  border ">
            <TableSale type={'OUTPUT'} />
          </div>
          <div className="flex flex-col gap-4 items-end p-20">
            <div className="flex gap-3 items-center ">
              <p>Payment Type</p>
              <Select
                onValueChange={handlePaymentTypeChange}
                value={invoice.payment_type ?? undefined}
              >
                <SelectTrigger id="payment" className="w-56">
                  <SelectValue placeholder="Select Customer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Online">PhonePay</SelectItem>
                  <SelectItem value="RTGS">PhonePay</SelectItem>
                 
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </form>
      <div className="h-20 shadow-inner w-full bg-white flex items-center justify-end p-4 space-x-3">
        <Button
          className="h-10 w-40"
          variant={'secondary'}
          onClick={() => console.log(invoice)}
        >
          Save and New
        </Button>
        <Button className="h-10 w-40" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default SaleInputTable
