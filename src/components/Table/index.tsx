'use client'
import { v4 as uuidv4 } from 'uuid'
import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from '@/components/ui/table'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { fetchItems, setupItemRealtime } from '@/redux/slices/ItemData'
import { Trash2 } from 'lucide-react'
import {
  addSaleItem,
  removeSaleItem,
  setSaleItems,
  updatePricePerUnit,
  updateSaleItem,
} from '@/redux/slices/saleItem'
import { Invoice, Product } from '@/lib/type'
export interface SaleItemE {
  id: string
  name: string
  productId: string
  description: string
  hsn: string
  qty: number | null
  rate: number | null
  price_per_unit: number | null
  amount: number | null
}
export type Item = {
  id: string
  name: string
  description: string
  hsn: string
  sale_price: number
  opening_quantity: number
}
interface TableSaleProps {
  type: string
}

const TableSale: React.FC<TableSaleProps> = ({ type }) => {
  const dispatch: AppDispatch = useDispatch()

  const { items, loading, error } = useSelector(
    (state: RootState) => state.items
  )
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)
  const handleDropdownToggle = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index)
  }

  const saleItems = useSelector((state: RootState) => state.saleItems) // Get saleItems from Redux

  const basePrice = (salePrice: number) => {
    return ((salePrice / (1 + 18 / 100)))
  }

  const handleQtyChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newQty = parseInt(event.target.value, 10)
    dispatch(updateSaleItem({ index, updatedItem: { qty: newQty } })) // Dispatch update action
  }

  const handleDeleteItem = (index: number) => {
    dispatch(removeSaleItem(index)) // Dispatch remove action
  }

  const handleItemSelect = (index: number, selectedItem: Item) => {
    const salePrice = selectedItem.sale_price
    const baseP = basePrice(selectedItem.sale_price ?? 0)
    dispatch(
      addSaleItem({
        index,
        newItem: {
          id: uuidv4(),
          productId: selectedItem.id.toString(),
          name: selectedItem.name,
          description: selectedItem.description,
          hsn: selectedItem.hsn,
          qty: 1,
          rate: baseP,
          price_per_unit: salePrice,
          amount: baseP,
        },
      })
    )
    setDropdownOpen(null)
  }

  const calculateTotal = () => {
    return parseFloat(
      saleItems.saleItems
        .reduce((sum, item) => sum + (item.amount ?? 0), 0)
        .toFixed(2)
    )
    
  }
  const calculateGST = () => {
    const discountAmount = calculateTotal() - saleItems.discount_on_amount
    return (
      (discountAmount + (discountAmount * 18) / 100 - discountAmount) /
      2
    ).toFixed(2)
  }

  const calculateQty = () => {
    return saleItems.saleItems.reduce((sum, item) => sum + (item.qty ?? 0), 0)
  }
  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target
    if (name === 'price_per_unit') {
      const price = parseFloat(value)
      dispatch(updatePricePerUnit({ index, price_per_unit: price }))
    } else if (name === 'description') {
      //   const price = parseFloat(value)
      dispatch(updateSaleItem({ index, updatedItem: { description: value } }))
    } else {
      const newSaleItems = [...saleItems.saleItems]
      newSaleItems[index] = {
        ...newSaleItems[index],
        [name]: value,
      }

      newSaleItems[index].rate = basePrice(
        newSaleItems[index].price_per_unit ?? 0
      )
      newSaleItems[index].amount =
        (newSaleItems[index].qty ?? 0) * (newSaleItems[index].rate ?? 0)

      setSaleItems(newSaleItems)
    }
  }
  //  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //    const discount = parseFloat(event.target.value) || 0
  //    dispatch(setDiscount(discount))
  //  }
  useEffect(() => {
    dispatch(fetchItems()) // Fetch initial data

    const unsubscribe = setupItemRealtime(dispatch) // Set up real-time listener

    return () => {
      unsubscribe() // Unsubscribe when the component unmounts
    }
  }, [dispatch])

  return (
    <div className="bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-3 w-10">#</TableHead>
            <TableHead className="p-3 ">Name</TableHead>
            <TableHead className="p-3 w-40 ">Description</TableHead>
            <TableHead className="p-3 w-40 ">HSN</TableHead>
            <TableHead className="p-3 w-32 ">Qty</TableHead>
            <TableHead className="p-3 w-32  ">
              <span>Rate</span>
              <span className="text-xs">(Exl tax rate)</span>
            </TableHead>
            <TableHead className="p-3 w-32 ">Price/unit</TableHead>
            <TableHead className="p-3 w-32 ">Amount</TableHead>
            <TableHead className="p-3 w-16 ">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {saleItems.saleItems.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="justify-center flex h-full items-center">
                {index + 1}
              </TableCell>
              <TableCell
                className="p-0 border "
                style={{ position: 'relative' }}
              >
                <input
                  className=" w-full h-9 p-3 "
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={(event) => handleChange(index, event)}
                  // readOnly // Make input read-only
                  onClick={() => handleDropdownToggle(index)}
                  style={{ cursor: 'pointer' }}
                />

                {dropdownOpen === index && (
                  <div className="absolute top-full left-0 rounded-sm p-2 shadow-sm bg-neutral-50 z-50 w-[500px]">
                    <table className="w-full leading-7">
                      <tr className="border-b w-full">
                        <th className="text-left">Item </th>
                        <th>Quantity</th>
                        <th>Sale Price</th>
                        <th>purchase</th>
                      </tr>
                      {!loading
                        ? items
                            .filter((items) =>
                              items.name
                                .toLowerCase()
                                .includes(item.name.toLowerCase())
                            )
                            .map((item) => (
                              <tr
                                key={item.id}
                                onClick={() => handleItemSelect(index, item)}
                                className="p-1 cursor-pointer hover:bg-neutral-100 "
                              >
                                <td> {item.name}</td>
                                <td className="text-center">
                                  {item.opening_quantity}
                                </td>
                                <td className="text-center">
                                  {item.sale_price}
                                </td>
                                <td className="text-center">
                                  {item.purchase_price}
                                </td>
                              </tr>
                            ))
                        : error
                        ? 'Something went wrong'
                        : '...Loading'}
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
              <TableCell className=" border ">{item.hsn}</TableCell>
              <TableCell className=" border">
                <input
                  className=" w-full h-9 p-3 "
                  type="number"
                  name="qty"
                  value={item.qty ?? ''}
                  onChange={(event) => handleQtyChange(index, event)}
                />
              </TableCell>

              <TableCell className=" border">
                {Math.floor((item.rate ?? 0) * 100) / 100}
              </TableCell>
              <TableCell className="p-0 border">
                <input
                  className=" w-full h-9 p-3 "
                  type="number"
                  name="price_per_unit"
                  value={item.price_per_unit ?? ''}
                  onChange={(event) => handleChange(index, event)}
                />
              </TableCell>
              <TableCell className=" border">
                {Math.floor((item.amount ?? 0 )* 100) / 100}
              </TableCell>
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
              colSpan={8}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            >
              {calculateTotal()}
            </TableCell>
          </TableRow>
          {/* <TableRow>
            <TableCell
              colSpan={2}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            >
              Discount
            </TableCell>

            <TableCell
              colSpan={3}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            ></TableCell>
            <TableCell
              colSpan={3}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            >
              <input
                className="w-full"
                type="number"
                name="discount_on_amount"
                value={saleItems.discount_on_amount}
                onChange={handleDiscountChange}
              />
            </TableCell>
          </TableRow> */}
          <TableRow>
            <TableCell
              colSpan={2}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            >
              {type} SGST
            </TableCell>

            <TableCell
              colSpan={3}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            ></TableCell>
            <TableCell
              colSpan={3}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            >
              {calculateGST()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={2}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            >
              {type} CGST
            </TableCell>

            <TableCell
              colSpan={3}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            ></TableCell>
            <TableCell
              colSpan={3}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            >
              {calculateGST()}
            </TableCell>
          </TableRow>
          <TableRow className="border">
            <TableCell
              colSpan={2}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            >
              TOTAL
            </TableCell>

            <TableCell
              colSpan={3}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            >
              {calculateQty()}
            </TableCell>
            <TableCell
              colSpan={3}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            >
              {(calculateTotal() + (calculateTotal() * 18) / 100).toFixed(0)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export default TableSale
