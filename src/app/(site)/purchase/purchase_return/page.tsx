'use client'
import React from 'react'
import PurchaseInvoiceBill from '@/components/InvoiceBill/purchaseBill'

const PurchaseReturn: React.FC = () => {
  return (
    <div className="h-full bg-white">
      <div className="flex bg-white items-center gap-4 px-4 h-14 shadow-lg">
        <h1 className="text-2xl font-bold">Purchase Return</h1>
      </div>
      <div>
        <PurchaseInvoiceBill invoiceType={'purchase_return'}  />
        
      </div>
    </div>
  )
}

export default PurchaseReturn
