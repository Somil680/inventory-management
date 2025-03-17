'use client'
import React from 'react'
import InvoiceBill from '@/components/InvoiceBill'

const PurchaseReturn: React.FC = () => {
  return (
    <div className="h-full bg-white">
      <div className="flex bg-white items-center gap-4 px-4 h-14 shadow-lg">
        <h1 className="text-2xl font-bold">Purchase Return</h1>
      </div>
      <div>
        <InvoiceBill invoiceType={'purchase_return'} gstType="INPUT" switchBtn={false} />
      </div>
    </div>
  )
}

export default PurchaseReturn
