// import { X } from 'lucide-react'
import * as React from 'react'

interface FloatingInputProps extends React.ComponentProps<'input'> {
  label: string
  className?: string
  removeText?: () => void
  value?: string | number | string[] | undefined
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  className,
  // removeText,
  value,
  ...props
}) => {
  return (
    <label
      className={`relative flex items-center p-1 h-[40px] w-[300px] rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 ${className}`}
    >
      <input
        type="text"
        className="peer border-none bg-transparent w-full px-2 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
        placeholder={label}
        value={value || ''}
        {...props}
      />
      <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600">
        {label}
      </span>
      {/* {value && ( // Show the X icon only when there's a value
        <X
          onClick={removeText}
          className="text-gray-500 absolute right-3 top-1/2 -translate-y-1/2"
          size={20}
        />
      )} */}
      {/* <X
        onClick={removeText}
        className=" text-gray-500 "
        size={20}
      /> */}
    </label>
  )
}

export default FloatingInput
