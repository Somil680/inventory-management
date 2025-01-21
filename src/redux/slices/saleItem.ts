// saleItemsSlice.ts (Redux Slice)
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SaleItemE } from '@/lib/type'

interface SaleItemsState {
  bill_amount: number
  discount_on_amount: number
  saleItems: SaleItemE[]
}

const initialState: SaleItemsState = {
  bill_amount: 0,
  discount_on_amount: 0,
  saleItems: [
    {
      id: '',
      name: '',
      productId: '',
      description: '',
      hsn: '',
      qty: null,
      rate: null,
      price_per_unit: null,
      amount: null,
    },
  ],
}
const basePrice = (salePrice: number) => {
  return parseFloat((salePrice / (1 + 18 / 100)).toFixed(2))
}
const saleItemsSlice = createSlice({
  name: 'saleItems',
  initialState,
  reducers: {
    addSaleItem: (
      state,
      action: PayloadAction<{ index: number; newItem: SaleItemE }>
    ) => {
      const { index, newItem } = action.payload

      // Check if the current item being added already exists (has an ID)
      if (state.saleItems[index] && state.saleItems[index].id !== '') {
        // Find the next empty row index
        let nextEmptyIndex = state.saleItems.findIndex((item) => item.id === '')
        if (nextEmptyIndex === -1) {
          state.saleItems.push({
            id: '',
            name: '',
            productId: '',
            description: '',
            hsn: '',
            qty: null,
            rate: null,
            price_per_unit: null,
            amount: null,
          })
          nextEmptyIndex = state.saleItems.length - 1
        }
        state.saleItems[nextEmptyIndex] = newItem
      } else {
        state.saleItems[index] = newItem
        if (index === state.saleItems.length - 1) {
          state.saleItems.push({
            id: '',
            name: '',
            productId: '',
            description: '',
            hsn: '',
            qty: null,
            rate: null,
            price_per_unit: null,
            amount: null,
          })
        }
      }
      recalculateBillAmount(state)
    },
    removeSaleItem: (state, action: PayloadAction<number>) => {
      state.saleItems.splice(action.payload, 1)
      recalculateBillAmount(state)
    },
    updateSaleItem: (
      state,
      action: PayloadAction<{ index: number; updatedItem: Partial<SaleItemE> }>
    ) => {
      const { index, updatedItem } = action.payload
      state.saleItems[index] = { ...state.saleItems[index], ...updatedItem }
     state.saleItems[index].amount = (
       (
         (state.saleItems[index].qty ?? 0) * (state.saleItems[index].rate ?? 0)
       )
     )
      if (updatedItem.description !== undefined) {
        state.saleItems[index].description = updatedItem.description
      }

      state.saleItems[index].rate = basePrice(
        state.saleItems[index].price_per_unit ?? 0
      )
      recalculateBillAmount(state)
    },
    setSaleItems: (state, action: PayloadAction<SaleItemE[]>) => {
      state.saleItems = action.payload
      recalculateBillAmount(state)
    },
    updatePricePerUnit: (
      state,
      action: PayloadAction<{ index: number; price_per_unit: number }>
    ) => {
      const { index, price_per_unit } = action.payload
      state.saleItems[index].price_per_unit = price_per_unit
      state.saleItems[index].rate = (
        (price_per_unit / (1 + 18 / 100))
      )
      state.saleItems[index].amount =
        (((state.saleItems[index].qty ?? 0) * (state.saleItems[index].rate ?? 0)))
      state.bill_amount = state.saleItems[index].amount 
      recalculateBillAmount(state)
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount_on_amount = action.payload
      recalculateBillAmount(state)
    },
  },
})
const recalculateBillAmount = (state: SaleItemsState) => {
  state.bill_amount = state.saleItems.reduce(
    (sum, item) => sum + (item.amount ?? 0),
    0
  )
  state.bill_amount -= state.discount_on_amount
}
export const {
  addSaleItem,
  removeSaleItem,
  updateSaleItem,
  setSaleItems,
  updatePricePerUnit,
  setDiscount,
} = saleItemsSlice.actions
export default saleItemsSlice.reducer
