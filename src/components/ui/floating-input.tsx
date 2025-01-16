import * as React from 'react'

interface FloatingInputProps extends React.ComponentProps<'input'> {
  label: string
  className?: string
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <label
      className={`relative flex h-[40px] w-[300px] rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 ${className}`}
    >
      <input
        type="text"
        className="peer border-none bg-transparent w-full px-2 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
        placeholder={label}
        {...props}
      />
      <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600">
        {label}
      </span>
    </label>
  )
}

export default FloatingInput
