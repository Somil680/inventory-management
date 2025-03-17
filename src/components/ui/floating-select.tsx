'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import {  ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

interface FloatingSelectProps<T extends string | number>
  extends Omit<
    React.ComponentProps<typeof SelectPrimitive.Root>,
    'value' | 'onValueChange'
  > {
  label: string
  options: { value: T; label: string }[]
  className?: string
  value?: T | null
  onValueChange?: (value: T) => void
}

const FloatingSelect = <T extends string | number>({
  label,
  options,
  className,
  value,
  onValueChange,
  ...props
}: FloatingSelectProps<T>) => {
  return (
    <SelectPrimitive.Root
      value={value as string}
      onValueChange={onValueChange as (value: string) => void}
      {...props}
    >
      <label
        className={cn(
          'relative flex items-center p-1 h-[40px] w-[250px] rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600',
          className
        )}
      >
        <SelectPrimitive.Trigger className="peer border-none bg-transparent w-full px-2 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 appearance-none">
          <SelectPrimitive.Value placeholder={label} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600">
          {label}
        </span>
        <SelectPrimitive.Content className="relative w-[250px] top-10 border-4 border-red-700">
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value as string}
              >
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
                {/* <SelectPrimitive.ItemIndicator> */}
                  {/* <Check className="h-4 w-4" /> */}
                {/* </SelectPrimitive.ItemIndicator> */}
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </label>
    </SelectPrimitive.Root>
  )
}

export default FloatingSelect
