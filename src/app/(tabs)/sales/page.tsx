'use client'

import React, { useEffect, useState } from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from '@/components/ui/table'
import FloatingInput from '@/components/ui/floating-input'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { fetchItems } from '@/redux/slices/ItemData'
import { Trash2 } from 'lucide-react'
interface SaleItem {
  id: number
  name: string
  description: string
  hsn: string
  qty: number
  rate: number
  price_per_unit: number
  amount: number
}
interface Item {
  id: number
  name: string
  description: string
  hsn: string
  sale_price: number
  // ... other properties
}

const SaleInputTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const { items, loading, error } = useSelector(
    (state: RootState) => state.items
  )
  console.log("🚀 ~ error:", error)
  console.log("🚀 ~ loading:", loading)



  const [saleItems, setSaleItems] = useState<SaleItem[]>([
    {
      id: 1,
      name: '',
      description: '',
      hsn: '',
      qty: 1,
      rate: 0,
      price_per_unit: 0,
      amount: 0,
    },
  ])
  console.log("🚀 ~ saleItems:", saleItems)
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)

  const handleAddItem = () => {
    setSaleItems([
      ...saleItems,
      {
        id: saleItems.length + 1,
        name: '',
        description: '',
        hsn: '',
        qty: 1,
        rate: 0,
        price_per_unit: 0,
        amount: 0,
      },
    ])
  }

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target
    const newSaleItems = [...saleItems]
    newSaleItems[index] = {
      ...newSaleItems[index],
      [name]: value,
    }
    newSaleItems[index].amount =
      newSaleItems[index].qty * newSaleItems[index].price_per_unit
    setSaleItems(newSaleItems)
  }

  const handleDeleteItem = (index: number) => {
    const newSaleItems = [...saleItems]
    newSaleItems.splice(index, 1)
    setSaleItems(newSaleItems)
  }
  const handleItemSelect = (index: number, selectedItem: Item) => {
    const newSaleItems = [...saleItems]
    newSaleItems[index] = {
      ...newSaleItems[index],
      name: selectedItem.name,
      description: selectedItem.description,
      hsn: selectedItem.hsn,
      rate: selectedItem.sale_price,
      price_per_unit: selectedItem.sale_price,
      amount: newSaleItems[index].qty * selectedItem.sale_price,
    }
    setSaleItems(newSaleItems)
    setDropdownOpen(null) // Close the dropdown
  }
  const calculateTotal = () => {
    return saleItems.reduce((sum, item) => sum + item.amount, 0)
  }
    const handleDropdownToggle = (index: number) => {
      setDropdownOpen(dropdownOpen === index ? null : index)
    }

  useEffect(() => {
     dispatch(fetchItems()) // Fetch items with category filter
   }, [dispatch])

  return (
    <div>
      <div className="w-full h-screen">
        <div className="flex items-center gap-4 px-4 shadow-lg">
          <h1 className="text-2xl font-bold">Sales</h1>
          <div className="flex items-center gap-2">
            <p>Credit</p>

            {/* <Switch
            content="cash"
            checked={sa}
            onCheckedChange={() => setsa(!sa)}
          /> */}
            <p>Cash</p>
            {/* {sa} */}
          </div>
        </div>
        <div className="bg-[#f3f3f3">
          <div className="flex justify-between items-start p-10">
            <div className="flex gap-2">
              <FloatingInput label="Customer" />
              <FloatingInput label="Phone" />
            </div>
            <div className="gap-2 flex flex-col">
              <FloatingInput label="Invoice no." />
              <FloatingInput label="Invoice Date" />
            </div>
          </div>
          <div className="  border ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-3 w-10">#</TableHead>
                  <TableHead className="p-3 ">Name</TableHead>
                  <TableHead className="p-3 w-40 ">Description</TableHead>
                  <TableHead className="p-3 w-40 ">HSN</TableHead>
                  <TableHead className="p-3 w-32 ">Qty</TableHead>
                  <TableHead className="p-3 w-32 ">Rate</TableHead>
                  <TableHead className="p-3 w-32 ">Price/unit</TableHead>
                  <TableHead className="p-3 w-32 ">Amount</TableHead>
                  <TableHead className="p-3 w-16 ">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell
                      className="p-0 border "
                      style={{ position: 'relative' }}
                    >
                      <input
                        className=" w-full h-9 p-3 "
                        type="text"
                        name="name"
                        value={item.name}
                        readOnly // Make input read-only
                        onClick={() => handleDropdownToggle(index)}
                        style={{ cursor: 'pointer' }}
                      />

                      {dropdownOpen === index && (
                        <div className="absolute top-full left-0 rounded-sm p-2 shadow-sm bg-neutral-50 z-50 w-full">
                          <table className="w-full leading-7">
                            <tr className="border-b w-full">
                              <th className="text-left">Item </th>
                              <th>Quantity</th>
                            </tr>

                            {items.map((item) => (
                              <tr
                                key={item.id}
                                onClick={() => handleItemSelect(index, item)}
                                className="p-1 cursor-pointer hover:bg-neutral-100 "
                              >
                                <td> {item.name}</td>
                                <td className="text-center">
                                  {item.opening_quantity}
                                </td>
                              </tr>
                            ))}
                          </table>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="p-0 border">
                      <input
                        className=" w-full h-9 p-3 "
                        type="text"
                        name="description"
                        value={item.description}
                        onChange={(event) => handleChange(index, event)}
                      />
                    </TableCell>
                    <TableCell className="p-0 border ">
                      {item.hsn}
                      {/* <input
                        className=" w-full h-9 p-3 "
                        type="text"
                        name="hsn"
                        value={item.hsn}
                        onChange={(event) => handleChange(index, event)}
                      /> */}
                    </TableCell>
                    <TableCell className=" border">
                      <input
                        className=" w-full h-9 p-3 "
                        type="number"
                        name="qty"
                        value={item.qty}
                        onChange={(event) => handleChange(index, event)}
                      />
                    </TableCell>
                    <TableCell className=" border">
                      {item.rate}
                      {/* <input
                        className=" w-full h-9 p-3 "
                        type="number"
                        name="rate"
                        value={item.price}
                        onChange={(event) => handleChange(index, event)}
                      /> */}
                    </TableCell>
                    <TableCell className="p-0 border">
                      <input
                        className=" w-full h-9 p-3 "
                        type="number"
                        name="price_per_unit"
                        value={item.price_per_unit}
                        onChange={(event) => handleChange(index, event)}
                      />
                    </TableCell>
                    <TableCell className=" border">{item.amount}</TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => handleDeleteItem(index)}>
                        <Trash2 color="gray" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    style={{ textAlign: 'center', fontWeight: 'bold' }}
                    onClick={handleAddItem}
                  >
                    <span className="border bg-blue-500 py-2 px-4 text-white rounded-2xl ">
                      Add Item
                    </span>
                  </TableCell>
                  <TableCell
                    colSpan={5}
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                  >
                    Total:
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>
                    {calculateTotal()}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>

        {/* <Sale/> */}
      </div>
    </div>
  )
}

export default SaleInputTable


























// import Autocomplete from '@/components/ItemSearch'
// import FloatingInput from '@/components/ui/floating-input'
// import { Switch } from '@/components/ui/switch'
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
//   TableFooter,
// } from '@/components/ui/table'
// import React, { useState } from 'react'

// const Sales = () => {
//   const [itemNumber, setItemNumber] = useState<number[]>([1, 2])
//   const handleAddRow = () => {
//     setItemNumber([...itemNumber, itemNumber.length + 1])
//   }
//   const [sa, setsa] = useState(true)
   
//   const [tableData, setTableData] = useState<any[]>([]) // Define an array for table data

//   const handleDataFromChild = (data) => {
//     console.log('Data received from child:', data)
//     setTableData([...tableData, data]) // Update the table data with the received data
//   }

//   return (
    // <div className="w-full h-screen">
    //   <div className="flex items-center gap-4 px-4 shadow-lg">
    //     <h1 className="text-2xl font-bold">Sales</h1>
    //     <div className="flex items-center gap-2">
    //       <p>Credit</p>

    //       <Switch
    //         content="cash"
    //         checked={sa}
    //         onCheckedChange={() => setsa(!sa)}
    //       />
    //       <p>Cash</p>
    //       {sa}
    //     </div>
    //   </div>
    //   <div className="bg-[#f3f3f3">
    //     <div className="flex justify-between items-start p-10">
    //       <div className="flex gap-2">
    //         <FloatingInput label="Customer" />
    //         <FloatingInput label="Phone" />
    //       </div>
    //       <div className="gap-2 flex flex-col">
    //         <FloatingInput label="Invoice no." />
    //         <FloatingInput label="Invoice Date" />
    //       </div>
    //     </div>
    //     <div className="  border ">
    //       {/* <Table className="h-full  border">
    //         <TableHeader>
    //           <TableRow className="">
    //             <TableHead className="w-[30px] border">#</TableHead>
    //             <TableHead className="border">Item</TableHead>
    //             <TableHead className="border">description</TableHead>
    //             <TableHead className="border">HSN</TableHead>
    //             <TableHead className="border">Qty</TableHead>
    //             <TableHead className="border">Price/Uint</TableHead>
    //             <TableHead className="text-right border">Amount</TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {itemNumber.map((rowNo) => (
    //             <>
          
    //               <Autocomplete
    //                 key={rowNo}
    //                   rowNo={rowNo}
    //                   onDataChange={handleDataFromChild}
    //                 />
                
    //             </>
    //           ))}
    //         </TableBody>
    //         <TableFooter>
    //           <TableRow>
    //             <TableCell colSpan={1}></TableCell>
    //             <TableCell colSpan={1} onClick={handleAddRow}>
    //               Add Row{' '}
    //             </TableCell>
    //             <TableCell className="text-right">Total = </TableCell>
    //             <TableCell className="text-right"></TableCell>
    //             <TableCell className="text-right"></TableCell>
    //             <TableCell className="text-right"></TableCell>
    //             <TableCell className="text-right"></TableCell>
    //           </TableRow>
    //         </TableFooter>
    //       </Table> */}
    //     </div>
    //   </div>

    //   {/* <Sale/> */}
    // </div>
// }

// export default Sales
