'use client'
import React from 'react'
import PurchaseInvoiceBill from '@/components/InvoiceBill/purchaseBill'

const PurchaseBill: React.FC = () => {
  return (
    <div className="h-full bg-white">
      <div className="flex  items-center gap-4 px-4 h-14 shadow-lg">
        <h1 className="text-2xl font-bold">Purchase Bill</h1>
      </div>
      <div>
        <PurchaseInvoiceBill invoiceType={'purchase'}  />
      </div>
    </div>
  )
}

export default PurchaseBill
