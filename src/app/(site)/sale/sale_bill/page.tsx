

'use client'
import React from 'react'
import InvoiceBill from '@/components/InvoiceBill/saleBill'
// import InvoicePreview from '@/components/InvoicePreview'

const SaleBill: React.FC = () => {
  return (
    <div className="h-full bg-white">
      <div className="flex bg-white items-center gap-4 px-4 h-14 shadow-lg">
        <h1 className="text-2xl font-bold">Sale Bill</h1>
      </div>
      <div>
        <InvoiceBill invoiceType={'cash'} />
        
        {/* <InvoicePreview/> */}
      </div>
    </div>
  )
}

export default SaleBill
