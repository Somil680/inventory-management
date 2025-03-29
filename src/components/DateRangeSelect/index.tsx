import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'

interface DateRangeSelectProps {
  onChange: (value: string) => void
  initialValue?: string
  className?: string
}

const DateRangeSelect: React.FC<DateRangeSelectProps> = ({
  className,
  onChange,
  initialValue = 'today',
}) => {
  const [inputItem, setInputItem] = useState(initialValue)

  useEffect(() => {
    onChange(inputItem)
  }, [inputItem, onChange])

  return (
    <Select value={inputItem} onValueChange={setInputItem} >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select Date Range" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="this_week">This week</SelectItem>
          <SelectItem value="this_month">This month</SelectItem>
          <SelectItem value="last_month">Last month</SelectItem>
          <SelectItem value="this_year">This year</SelectItem>
          <SelectItem value="last_year">Last year</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default DateRangeSelect
