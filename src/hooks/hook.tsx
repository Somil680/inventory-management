import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfYear,
  subMonths,
  subYears,
  format,
} from 'date-fns'

export const getDateRange = (filter: string) => {
  const today = new Date()
  let startDate: string, endDate: string

  switch (filter) {
    case 'today':
      startDate = endDate = format(startOfDay(today), 'yyyy-MM-dd')
      break

    case 'this_week':
      startDate = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd') // Monday as start of the week
      endDate = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
      break

    case 'this_month':
      startDate = format(startOfMonth(today), 'yyyy-MM-dd')
      endDate = format(endOfMonth(today), 'yyyy-MM-dd')
      break

    case 'last_month':
      const lastMonth = subMonths(today, 1)
      startDate = format(startOfMonth(lastMonth), 'yyyy-MM-dd')
      endDate = format(endOfMonth(lastMonth), 'yyyy-MM-dd')
      break

    case 'this_year':
      startDate = format(startOfYear(today), 'yyyy-MM-dd')
      endDate = format(endOfYear(today), 'yyyy-MM-dd')
      break

    case 'last_year':
      const lastYear = subYears(today, 1)
      startDate = format(startOfYear(lastYear), 'yyyy-MM-dd')
      endDate = format(endOfYear(lastYear), 'yyyy-MM-dd')
      break

    default:
      startDate = endDate = format(startOfDay(today), 'yyyy-MM-dd')
  }

  return { startDate, endDate }
}

export const formatDates = (date: Date | number): string => {
  const dateObj = typeof date === 'number' ? new Date(date) : date
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
export function formatDate(
  dateString: string | Date | null | undefined
): string {
  if (!dateString) {
    return 'Invalid Date 1' // Handle null or undefined input
  }

  try {
    let date: Date

    if (typeof dateString === 'string') {
      date = new Date(dateString)
      if (isNaN(date.getTime())) {
        // Check for truly invalid date strings
        return 'Invalid Date 2'
      }

      // Check if the date is actually valid (handles cases like "2024-02-30")
      if (date.toString() === 'Invalid Date') {
        return 'Invalid Date 3'
      }
    } else if (dateString instanceof Date) {
      date = dateString
    } else {
      return 'Invalid Date 4' // Handle other invalid input types
    }

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date 5'
  }
}

export function formatCurrencyINR(amount: number | string): string {
  try {
    const num = Number(amount)
    if (isNaN(num)) {
      return 'Invalid Amount'
    }
    return num.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'INR',
    })
  } catch (error) {
    console.error('Error formatting currency', error)
    return 'Invalid Amount'
  }
}
export function formatString(str: string): string {
  return str
    .split('_') // Split by underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
    .join(' ') // Join words with space
}
