// saleItemsSlice.ts (Redux Slice)
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SaleItemE } from '@/lib/type'

interface SaleItemsState {
  bill_amount: number
  discount_on_amount: number | null
  saleItems: SaleItemE[]
}

const initialState: SaleItemsState = {
  bill_amount: 0,
  discount_on_amount: null,
  saleItems: [
    {
      id: '',
      name: '',
      productId: '',
      description: '',
      hsn: '',
      qty: null,
      tax: null,
      taxAmt: null,
      rate: null,
      price_per_unit: null,
      amount: null,
    },
  ],
}

const basePrice = (salePrice: number) => {
  return parseFloat((salePrice / (1 + 18 / 100)).toFixed(0))
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
            tax: null,
            taxAmt: null,
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
            tax: null,
            taxAmt: null,
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
      state.saleItems[index].amount =
        (state.saleItems[index].qty ?? 0) * (state.saleItems[index].rate ?? 0)
      state.saleItems[index].taxAmt = Number(
        (
          (state.saleItems[index].qty ?? 0) *
          ((state.saleItems[index].price_per_unit ?? 0) -
            (state.saleItems[index].rate ?? 0))
        ).toFixed(2)
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
      state.saleItems[index].rate =
        price_per_unit / (1 + (state.saleItems[index].tax ?? 0) / 100)
      state.saleItems[index].amount =
        (state.saleItems[index].qty ?? 0) * (state.saleItems[index].rate ?? 0)
      state.bill_amount = Number(state.saleItems[index].amount)
      state.saleItems[index].taxAmt = Number(
        (
          (state.saleItems[index].qty ?? 0) *
          ((state.saleItems[index].price_per_unit ?? 0) -
            (state.saleItems[index].rate ?? 0))
        ).toFixed(2)
      )
      recalculateBillAmount(state)
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount_on_amount = action.payload
   
      recalculateBillAmount(state)
    },
    clearSaleItemsOnSubmit: (state) => {
      state.saleItems = [
        {
          id: '',
          name: '',
          productId: '',
          description: '',
          hsn: '',
          qty: null,
          tax: null,
          taxAmt: null,
          rate: null,
          price_per_unit: null,
          amount: null,
        },
      ] // Set saleItems to an empty array
      state.bill_amount = 0 // Reset bill amount
      state.discount_on_amount = 0 // Reset discount amount
      recalculateBillAmount(state)
    },
  },
})
const recalculateBillAmount = (state: SaleItemsState) => {
  state.bill_amount = state.saleItems.reduce(
    (sum, item) => sum + (Number(item.amount) ?? 0),
    0
  )
  const taxampunt = state.saleItems.reduce(
    (sum, item) => sum + (Number(item.taxAmt) ?? 0),
    0
  )
  // state.bill_amount = Number(
  //   (state.bill_amount + (state.bill_amount * 18) / 100 - discount).toFixed(2)
  // )
  state.bill_amount  = Number((state.bill_amount + taxampunt).toFixed(2))
}
export const {
  addSaleItem,
  removeSaleItem,
  updateSaleItem,
  setSaleItems,
  updatePricePerUnit,
  setDiscount,
  clearSaleItemsOnSubmit,
} = saleItemsSlice.actions
export default saleItemsSlice.reducer
