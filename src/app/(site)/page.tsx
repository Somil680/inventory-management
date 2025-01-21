'use client'
import { fetchInvoices, setupInvoiceRealtime } from "@/redux/slices/InvoiceData"
import { AppDispatch } from "@/redux/store"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function Page() {
   const dispatch = useDispatch<AppDispatch>()
 

   useEffect(() => {
     dispatch(fetchInvoices())

     const unsubscribe = setupInvoiceRealtime(dispatch) // Set up real-time

     return () => unsubscribe() // Clean up subscription
   }, [dispatch])

 
  return (
      
     
        <div className="flex flex-1 flex-col gap-4 p-4 pt-3">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" ></div>
            <div className="aspect-video rounded-xl bg-muted/50" ></div>
            <div className="aspect-video rounded-xl bg-muted/50" ></div>
          </div>
          <div className="h-[1000px] flex-1 rounded-xl bg-muted/50 md:min-h-min" ></div>
        </div>
  )
}
