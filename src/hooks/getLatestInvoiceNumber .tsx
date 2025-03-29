// import { format } from 'date-fns'
// // Mock function to get the latest invoice number (Replace with DB query)
// const getLatestInvoiceNumber = (invoiceType: string) => {
//   const storedCounter = localStorage.getItem(`invoiceCounter_${invoiceType}`)
//   return storedCounter ? parseInt(storedCounter, 10) : 0
// }

// const generateInvoiceNumber = (invoiceType: string) => {
//   const prefixMap: Record<string, string> = {
//     sales: 'SAL',
//     purchase: 'PUR',
//     expense: 'EXP',
//   }

//   const prefix = prefixMap[invoiceType] || 'INV'
//   const datePart = format(new Date(), 'yyyyMM') // Format as YYYYMM
//   const latestInvoice = getLatestInvoiceNumber(invoiceType) + 1

//   // Save the new counter value
//   localStorage.setItem(
//     `invoiceCounter_${invoiceType}`,
//     latestInvoice.toString()
//   )

//   return `${prefix}-${datePart}-${latestInvoice.toString().padStart(4, '0')}`
// }
//  export default generateInvoiceNumber

// // export default function InvoiceGenerator({
// //   invoiceType,
// // }: {
// //   invoiceType: string
// // }) {
// //   const [invoiceNo, setInvoiceNo] = useState('')

// //   useEffect(() => {
// //     setInvoiceNo(generateInvoiceNumber(invoiceType))
// //   }, [invoiceType])

// //   return (
// //     <div>
// //       <p>
// //         Invoice Number: <strong>{invoiceNo}</strong>
// //       </p>
// //     </div>
// //   )
// // }
// import { useState, useEffect } from 'react'
// import { fetchInvoices } from '@/lib/invoiceAction'
// import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

// Get the latest invoice number from localStorage

// Generate a new invoice number
 const generateInvoiceNumber = (invoiceType: string) => {
  const getLatestInvoiceNumber = (invoiceType: string) => {
    // const { data } = useQuery({
    //   queryKey: ['Invoice'],
    //   queryFn: () => fetchInvoices(),
    //   select: (data) =>
    //     data?.filter((item) => item.invoice_type === invoiceType),
    // })

    // console.log('🚀 ~ getLatestInvoiceNumber ~ data:', data)
    const latestInvoice = localStorage.getItem(`latestInvoice_${invoiceType}`)

    if (!latestInvoice) return 0 // Default to 0 if no invoice exists

    const parts = latestInvoice.split('-')
    const lastDatePart = parts[1] // Extract YYYYMM part
    const lastCounter = parseInt(parts[2], 10) || 0 // Extract numeric part

    const currentDatePart = format(new Date(), 'yyyyMM')

    // If the month has changed, reset the counter
    if (lastDatePart !== currentDatePart) {
      return 0
    }

    return lastCounter
  }

  const prefixMap: Record<string, string> = {
    sales: 'SAL',
    purchase: 'PUR',
    expense: 'EXP',
  }

  const prefix = prefixMap[invoiceType] || 'INV'
  const datePart = format(new Date(), 'yyyyMM') // Format as YYYYMM
  const latestInvoice = getLatestInvoiceNumber(invoiceType) + 1 // Increment by 1

  const newInvoiceNo = `${prefix}-${datePart}-${latestInvoice
    .toString()
    .padStart(1, '0')}`

  // Save the new invoice number
  localStorage.setItem(`latestInvoice_${invoiceType}`, newInvoiceNo)

  return newInvoiceNo
}
export default  generateInvoiceNumber