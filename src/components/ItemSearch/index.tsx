'use-client'
import { fetchItems } from '@/redux/slices/ItemData'
import { RootState, AppDispatch } from '@/redux/store'
import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TableCell, TableRow } from '../ui/table'



interface AutocompleteProps {
  rowNo: number
  onDataChange: (data: InputValue | null) => void
  // rowIndex: number // Add rowIndex prop
}
interface InputValue {
        id:string
        name: string
        description: string
        qty: null| number,
        hsn: string
        rate: null| number,
        amount:null| number
}

const Autocomplete: React.FC<AutocompleteProps> = ({ rowNo , onDataChange   }) => {
  const dispatch: AppDispatch = useDispatch()
  const { items, } = useSelector(
    (state: RootState) => state.items
  )
  const [inputValue, setInputValue] = useState<InputValue>({
    id: '',
    name: '',
    description: '',
    qty: null,
    hsn: '',
    rate: null,
    amount: null,
  })
  console.log("🚀 ~ inputValue:", inputValue)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const newValue = value === '' ? null : parseFloat(value) // Parse to number or null if empty
    setInputValue((prev) => {
      let newAmount = prev.amount
      if (name === 'qty' || name === 'rate') {
        const qty = name === 'qty' ? newValue : prev.qty
        const rate = name === 'rate' ? newValue : prev.rate
        newAmount = qty !== null && rate !== null ? qty * rate : 0
      }
      return {
        ...prev,
        [name]: newValue,
        amount: newAmount,
      }
    })
  }
  const handleitemChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target
    setInputValue((prev) => {
      return {
        ...prev,
        name: value,
      }
    })

    setShowSuggestions(true)
  }
  const handleClick = (singleProduct) => {
    if (singleProduct) {
      // Check if singleProduct exists
      setInputValue({
        id: singleProduct.id,
        name: singleProduct.name, // Use optional chaining and default empty string
        description: '', // Use optional chaining and default empty string
        qty: 1,
        hsn: singleProduct.hsn,
        rate: singleProduct.sale_price,
        amount: singleProduct.sale_price,
      })
    } else {
      setInputValue({
        id: '',
        name: '',
        description: '',
        qty: null,
        hsn: '',
        rate: null,
        amount: null,
      })
      setShowSuggestions(false)
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
  }
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false)
    }, 1000)
  }

  useEffect(() => {
    dispatch(fetchItems()) // Fetch items with category filter
  }, [dispatch])

  //  useEffect(() => {
  //      onDataChange(inputValue)
  //  }, [ onDataChange])
  return (
    <>
      <TableRow key={rowNo}>
        
      <TableCell className="font-medium border w-8">{rowNo}</TableCell>
      <TableCell className="border h-9 p-0 ">
        <div className="relative ">
          <input
            type="text"
            value={inputValue.name}
            onChange={handleitemChange}
            name="name"
            ref={inputRef}
            onBlur={handleBlur}
            placeholder="Search..."
            className="w-full h-full px-4 py-2    focus:outline-none  text-black" // Tailwind classes
          />
          {showSuggestions && items.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border rounded shadow mt-1 z-10 text-black">
              {/* Tailwind classes */}
              {items.map((index) => (
                <li
                  key={index.id}
                  onClick={() => handleClick(index)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0" // Tailwind classes
                >
                  {index.name}
                  {typeof index}
                </li>
              ))}
            </ul>
          )}
        </div>
      </TableCell>

      <TableCell className="border w-32">
        {/* HSN */}
        <input
          type="text"
          value={inputValue.description}
          onChange={handleChange}
          name="description"
          className="w-full h-full px-4 py-2    focus:outline-none  text-black" // Tailwind classes
        />
      </TableCell>
      <TableCell className="border w-32">
        {/* HSN */}
        {inputValue.hsn}
      </TableCell>

      <TableCell className="border p-0 w-32">
        {/* QUANTITY */}
        <input
          type="text"
          value={inputValue.qty ? inputValue.qty : 0}
          onChange={handleChange}
          name="qty"
          //   onBlur={handleBlur}
          className="w-full h-full px-4 py-2    focus:outline-none  text-black" // Tailwind classes
        />
      </TableCell>

      <TableCell className="border w-32">
        {/* "RATE/PRICE" */}
        <input
          type="text"
          value={inputValue.rate ? inputValue.rate : 0}
          className="w-full h-full px-4 py-2    focus:outline-none  text-black" // Tailwind classes
        />
      </TableCell>

      <TableCell className="text-right border w-32">
        {/* AMOUNT */}
        {inputValue.amount}
      </TableCell>
       </TableRow>
    </>
  )
}

export default Autocomplete
// 'use-client'
// import { fetchItems } from '@/redux/slices/ItemData'
// import { RootState, AppDispatch } from '@/redux/store'
// import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { TableCell } from '../ui/table'



// interface AutocompleteProps {
//   rowNo: number
//   onDataChange: []
// }
// interface InputValue {
//         name: string
//         description: string
//         qty: null| number,
//         hsn: string
//         rate: null| number,
//         amount:null| number
// }

// const Autocomplete: React.FC<AutocompleteProps> = ({ rowNo , onDataChange  }) => {

//     const dispatch: AppDispatch = useDispatch()
//     const { items, loading, error } = useSelector(
//         (state: RootState) => state.items
//     )
//     // console.log("🚀 ~ Autocomplete ~ items:", items)

//     const [inputValue, setInputValue] = useState<InputValue>({
//       name: '',
//       description: '',
//       qty: null,
//       hsn: '',
//       rate: null,
//       amount: null
//     })
//     console.log("🚀 ~ inputValue:", inputValue)
    // const [suggestions, setSuggestions] = useState<Product[]>([])
    // const [showSuggestions, setShowSuggestions] = useState(false)
//     // const [isLoading, setIsLoading] = useState(false)
//     const inputRef = useRef<HTMLInputElement>(null)

//     useEffect(() => {
//         dispatch(fetchItems()) // Fetch items with category filter
//     }, [dispatch])
    
//     // useEffect(() => {
//     //     // let timeoutId: ReturnType<typeof setTimeout>

//     //     if (inputValue.name) {
//     //         setIsLoading(true)

//     //             try {


//     //                 setSuggestions([items])
//     //             } catch (error) {
//     //                 console.error('Error fetching suggestions:', error)
//     //                 setSuggestions([])
//     //             } finally {
//     //                 setIsLoading(false)
//     //             }
      
//     //     } else {
//     //         setSuggestions([])
//     //         setIsLoading(false)
//     //     }

//     //     return () => clearTimeout(timeoutId)
//     // }, [inputValue])

//     const handleChange = (
//         e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     ) => {
//         const { name, value } = e.target
//         setInputValue((prev) => {
//             return {
//                 ...prev,
//               [name]: value,
            
//               amount: inputValue.qty && inputValue.rate ? inputValue.qty * inputValue.rate  : 0 
//             }
//         })
       
        
//     }
//     const handleitemChange = (
//         e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     ) => {
//         const {  value } = e.target
//         setInputValue((prev ) => {
//             return {
//                 ...prev,
//                 name: value,
//             }                                                                      
//         })

//         setShowSuggestions(true)
//     }

//     const handleClick = (singleProduct) => {
//         if (singleProduct) { // Check if singleProduct exists
//             setInputValue({
//                 name: singleProduct.name , // Use optional chaining and default empty string
//                 description: '' , // Use optional chaining and default empty string
//                 qty: 1 ,
//                 hsn: singleProduct.hsn,
//                 rate: singleProduct.sale_price,
//                 amount:  singleProduct.sale_price 
//             });
//         } else {
//             // Handle the case where singleProduct is null or undefined
//             console.warn("singleProduct is not defined. Setting default values.");
//             setInputValue({
//               name: '',
//               description: '',
//               qty: null,
//               hsn: '',
//               rate: null,
//               amount: null,
//             })
        
      
//             // setSuggestions([])
//           setShowSuggestions(false)
//           // onDataChange(inputValue)
//             if (inputRef.current) {
//                 inputRef.current.blur()
//             }
//         }
//     }
//         const handleBlur = () => {
//             setTimeout(() => {
//                 setShowSuggestions(false)
//             }, 1000)
//         }
    
//         return (
//           <>
//             <TableCell className="font-medium border w-8">{rowNo}</TableCell>

//             <TableCell className="border h-9 p-0 ">
//               <div className="relative ">
//                 <input
//                   type="text"
//                   value={inputValue.name}
//                   onChange={handleitemChange}
//                   name="name"
//                   ref={inputRef}
//                   onBlur={handleBlur}
//                   placeholder="Search..."
//                   className="w-full h-full px-4 py-2    focus:outline-none  text-black" // Tailwind classes
//                 />
//                 {showSuggestions && items.length > 0 && (
//                   <ul className="absolute top-full left-0 w-full bg-white border rounded shadow mt-1 z-10 text-black">
//                     {/* Tailwind classes */}
//                     {items.map((index) => (
//                       <li
//                         key={index.id}
//                         onClick={() => handleClick(index)}
//                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0" // Tailwind classes
//                       >
//                         {index.name}
//                         {typeof index}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </TableCell>

//             <TableCell className="border w-32">
//               {/* HSN */}
//               <input
//                 type="text"
//                 value={inputValue.description}
//                 onChange={handleChange}
//                 name="description"
//                 className="w-full h-full px-4 py-2    focus:outline-none  text-black" // Tailwind classes
//               />
//             </TableCell>
//             <TableCell className="border w-32">
//               {/* HSN */}
//               {inputValue.hsn}
//             </TableCell>

//             <TableCell className="border p-0 w-32">
//               {/* QUANTITY */}
//               <input
//                 type="text"
//                 value={inputValue.qty ? inputValue.qty : 0}
//                 onChange={handleChange}
//                 name="qty"
//                 //   onBlur={handleBlur}
//                 className="w-full h-full px-4 py-2    focus:outline-none  text-black" // Tailwind classes
//               />
//             </TableCell>

//             <TableCell className="border w-32">
//               {/* "RATE/PRICE" */}
//               <input
//                 type="text"
//                 value={inputValue.rate ? inputValue.rate : 0}
//                 //   onChange={handleChange}
//                 //   ref={inputRef}
//                 //   onBlur={handleBlur}
//                 //   placeholder="Search..."
//                 className="w-full h-full px-4 py-2    focus:outline-none  text-black" // Tailwind classes
//               />
//             </TableCell>

//             <TableCell className="text-right border w-32">
//               {/* AMOUNT */}
//               {inputValue.qty && inputValue.amount
//                 ? inputValue.amount * inputValue.qty
//                 : inputValue.amount}
//             </TableCell>
//           </>
//         )
    
// }

// export default Autocomplete
