'use client'
import FloatingInput from '@/components/ui/floating-input'
import React, { useState } from 'react'

const Sale = () => {
  const [data, setData] = useState('')
  return (
    <div>
      {data}
      <FloatingInput
        label="name"
        name="name "
        onChange={(e) => setData(e.target.value)}
        placeholder="name"
      />
    </div>
  )
}

export default Sale
