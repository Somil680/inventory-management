'use client'
import React, { useState } from 'react'

const NumberAdder: React.FC = () => {
  const [num1, setNum1] = useState<number | undefined>(undefined)
  const [num2, setNum2] = useState<number | undefined>(undefined)
  const [num3, setNum3] = useState<number | undefined>(undefined)
  const [num4, setNum4] = useState<number | undefined>(undefined)
  const [total, setTotal] = useState<number | undefined>(undefined)

  const calculateTotal = () => {
    const numbers = [num1, num2, num3, num4].filter(
      (num) => num !== undefined
    ) as number[] // Filter out undefined values and type cast
    if (numbers.length === 0) {
      setTotal(0)
      return
    }
    const sum = numbers.reduce((acc, curr) => acc + curr, 0)
    setTotal(sum)
  }

  return (
    <div>
      <input
        type="number"
        placeholder="Number 1"
        value={num1 === undefined ? '' : num1}
        onChange={(e) => setNum1(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Number 2"
        value={num2 === undefined ? '' : num2}
        onChange={(e) => setNum2(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Number 3"
        value={num3 === undefined ? '' : num3}
        onChange={(e) => setNum3(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Number 4"
        value={num4 === undefined ? '' : num4}
        onChange={(e) => setNum4(Number(e.target.value))}
      />
      <button onClick={calculateTotal}>Calculate Total</button>
      {total !== undefined && <p>Total: {total}</p>}
    </div>
  )
}

export default NumberAdder
