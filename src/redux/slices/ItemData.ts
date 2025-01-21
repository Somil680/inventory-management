import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/utils/supabase/server' // Your Supabase client setup
import { AppDispatch } from '../store'
import {  Product } from '@/lib/type'

// Define the type for your data


interface ItemsState {
  items: Product[]
  loading: boolean
  error: string | null
}

// Async thunk for fetching items from Supabase
export const fetchItems = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'items/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('product').select('*')
      if (error) {
        return rejectWithValue(error.message)
      }
      return data as Product[]
    } catch (error) {
      return rejectWithValue(
        (error as Error)?.message || 'An unknown error occurred.'
      )
    }
  }
)

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
}

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearItems: (state) => {
      state.items = []
    },
    // Reducer to update a single item (used by real-time updates)
    updateItem: (state, action: PayloadAction<Product>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      )
    },
    addItem: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload)
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch items'
      })
  },
})

export const { clearItems, updateItem, addItem, deleteItem } =
  itemsSlice.actions

// Real-time listener setup (outside the component)
export const setupItemRealtime = (dispatch: AppDispatch) => {
  const channel = supabase.channel('public:product')

  channel
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'product' },
      (payload) => {
        console.log('Realtime payload:', payload)
        if (payload.eventType === 'UPDATE') {
          dispatch(updateItem(payload.new as Product))
        } else if (payload.eventType === 'INSERT') {
          dispatch(addItem(payload.new as Product))
        } else if (payload.eventType === 'DELETE') {
          dispatch(deleteItem(payload.old.id))
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export default itemsSlice.reducer
