  export  const formatDates = (date: Date | number): string => {
      const dateObj = typeof date === 'number' ? new Date(date) : date
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const day = String(dateObj.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
}
  export  function formatDate(dateString: string | Date): string {
      try {
        let date: Date

        if (typeof dateString === 'string') {
          date = new Date(dateString)
        } else if (dateString instanceof Date) {
          date = dateString
        } else {
          return 'Invalid Date'
        }

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0') // Month is 0-indexed
        const year = date.getFullYear()

        return `${day}/${month}/${year}`
      } catch (error) {
        console.error('Error formatting date:', error)
        return 'Invalid Date' // Return a default value in case of error
      }
    }