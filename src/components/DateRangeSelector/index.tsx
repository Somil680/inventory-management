// // import { useState, useRef, useEffect } from 'react'
// // import FloatingInput from '../ui/floating-input'
// // import { formatDate } from '@/hooks/hook'
// // import { startOfMonth } from 'date-fns'

// // type Props = {
// //   onDateChange: (date1: string, date2: string) => void
// // }

// // export default function DateRangeInput({ onDateChange }: Props) {
// //   const today = new Date()
// //   const firstDayOfMonth = startOfMonth(today)

// //   const [date1, setDate1] = useState<string>(formatDate(firstDayOfMonth))
// //   const [date2, setDate2] = useState<string>(formatDate(new Date()))
// //   const date2Ref = useRef<HTMLInputElement>(null)

// //   const formatDateInput = (value: string) => {
// //     value = value.replace(/[^\d]/g, '') // Remove non-numeric characters
// //     console.log('🚀 ~ formatDateInput ~ value:', value)
// //     if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2)
// //     if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9)
// //     return value.length > 10 ? value.slice(0, 10) : value
// //   }

// //   const handleDate1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const formattedValue = formatDateInput(e.target.value)
// //     setDate1(formattedValue)

// //     // Auto-focus second input when first date is complete
// //     if (formattedValue.length === 10 && date2Ref.current) {
// //       date2Ref.current.focus()
// //     }

// //     // Send updated dates to parent
// //     onDateChange(formattedValue, date2)
// //   }

// //   const handleDate2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const formattedValue = formatDateInput(e.target.value)
// //     setDate2(formattedValue)

// //     // Send updated dates to parent
// //     onDateChange(date1, formattedValue)
// //   }
// //   useEffect(() => {
// //      onDateChange(date1 , date2)
// //    },[])
// //   return (
// //     <div className=" space-y-4 ">
// //       <div className="flex gap-2">
// //         <FloatingInput
// //           label="Start Date"
// //           type="text"
// //           placeholder="DD/MM/YYYY"
// //           value={date1}
// //           onChange={handleDate1Change}
// //           maxLength={10}
// //           className="w-1/2 p-2 border rounded"
// //           removeText={()=>setDate1('')}
// //         />
// //         <span className="self-center text-lg">-</span>
// //         <FloatingInput
// //           label="End Date"
// //           disabled={date1 === ''}
// //           type="text"
// //           ref={date2Ref}
// //           placeholder="DD/MM/YYYY"
// //           value={date2}
// //           onChange={handleDate2Change}
// //           maxLength={10}
// //           className="w-1/2 p-2 border rounded"
// //         />
// //       </div>
// //     </div>
// //   )
// // }
// import { useState, useRef, useEffect } from 'react'
// import FloatingInput from '../ui/floating-input'
// import { format, startOfMonth, startOfDay } from 'date-fns'

// type Props = {
//   onDateChange: (date1: string, date2: string) => void
// }

// export default function DateRangeInput({ onDateChange }: Props) {
//   const today = startOfDay(new Date())
//   const firstDayOfMonth = startOfMonth(today)

//   const [date1, setDate1] = useState<string>(
//     format(firstDayOfMonth, 'yyyy-MM-dd')
//   )
//   const [date2, setDate2] = useState<string>(format(today, 'yyyy-MM-dd'))
//   const date2Ref = useRef<HTMLInputElement>(null)

//   const formatDateInput = (value: string) => {
//     value = value.replace(/[^\d]/g, '') // Remove non-numeric characters
//     console.log('🚀 ~ formatDateInput ~ value:', value)
//     if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2)
//     if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9)
//     return value.length > 10 ? value.slice(0, 10) : value
//   }

//   const handleDate1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const formattedValue = formatDateInput(e.target.value)
//     setDate1(formattedValue)

//     // Auto-focus second input when first date is complete
//     if (formattedValue.length === 10 && date2Ref.current) {
//       date2Ref.current.focus()
//     }

//     // Send updated dates to parent
//     onDateChange(formattedValue, date2)
//   }

//   const handleDate2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const formattedValue = formatDateInput(e.target.value)
//     setDate2(formattedValue)

//     // Send updated dates to parent
//     onDateChange(date1, formattedValue)
//   }

//   useEffect(() => {
//     onDateChange(date1, date2)
//   }, []) // Ensures initial date values are sent

//   return (
//     <div className=" space-y-4 ">
//       <div className="flex gap-2">
//         <FloatingInput
//           label="Start Date"
//           type="text"
//           placeholder="YYYY-MM-DD"
//           value={date1}
//           onChange={handleDate1Change}
//           maxLength={10}
//           className="w-1/2 p-2 border rounded"
//           removeText={() => setDate1('')}
//         />
//         <span className="self-center text-lg">-</span>
//         <FloatingInput
//           label="End Date"
//           disabled={date1 === ''}
//           type="text"
//           ref={date2Ref}
//           placeholder="YYYY-MM-DD"
//           value={date2}
//           onChange={handleDate2Change}
//           maxLength={10}
//           className="w-1/2 p-2 border rounded"
//         />
//       </div>
//     </div>
//   )
// }
import { useState, useRef, useEffect } from 'react'
import FloatingInput from '../ui/floating-input'
import { parse, format, isValid, startOfMonth, startOfDay } from 'date-fns'

type Props = {
  onDateChange: (date1: string, date2: string) => void
}

export default function DateRangeInput({ onDateChange }: Props) {
  const today = startOfDay(new Date())
  const firstDayOfMonth = startOfMonth(today)

  // Initial state values converted to 'DD-MM-YYYY' format
  const [date1, setDate1] = useState<string>(
    format(firstDayOfMonth, 'dd-MM-yyyy')
  )
  const [date2, setDate2] = useState<string>(format(today, 'dd-MM-yyyy'))
  const date2Ref = useRef<HTMLInputElement>(null)

  // Converts DD-MM-YYYY to YYYY-MM-DD
  const convertToISOFormat = (dateStr: string): string | null => {
    const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date())
    return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : null
  }

  const formatDateInput = (value: string) => {
    value = value.replace(/[^\d]/g, '') // Remove non-numeric characters

    if (value.length > 2) value = value.slice(0, 2) + '-' + value.slice(2)
    if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5, 9)

    return value.length > 10 ? value.slice(0, 10) : value
  }

  const handleDate1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDateInput(e.target.value)
    setDate1(formattedValue)

    const isoDate = convertToISOFormat(formattedValue)
    if (isoDate) onDateChange(isoDate, convertToISOFormat(date2) || '')

    if (formattedValue.length === 10 && date2Ref.current) {
      date2Ref.current.focus()
    }
  }

  const handleDate2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDateInput(e.target.value)
    setDate2(formattedValue)

    const isoDate = convertToISOFormat(formattedValue)
    if (isoDate) onDateChange(convertToISOFormat(date1) || '', isoDate)
  }

  useEffect(() => {
    onDateChange(
      convertToISOFormat(date1) || '',
      convertToISOFormat(date2) || ''
    )
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <FloatingInput
          label="Start Date"
          type="text"
          placeholder="DD-MM-YYYY"
          value={date1}
          onChange={handleDate1Change}
          maxLength={10}
          className="w-1/2 p-2 border rounded"
          removeText={() => setDate1('')}
        />
        <span className="self-center text-lg">-</span>
        <FloatingInput
          label="End Date"
          disabled={date1 === ''}
          type="text"
          ref={date2Ref}
          placeholder="DD-MM-YYYY"
          value={date2}
          onChange={handleDate2Change}
          maxLength={10}
          className="w-1/2 p-2 border rounded"
        />
      </div>
    </div>
  )
}
