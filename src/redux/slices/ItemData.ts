import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/utils/supabase/server' // Your Supabase client setup

// Define the type for your data (replace with your actual type)
interface Item {
  id: number
  name: string
  category: string
  // ... other properties
}


interface ItemsState {
  items: Item[]
  loading: boolean
  error: string | null
}

// Async thunk for fetching items from Supabase with optional filters
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (_, { rejectWithValue }) => {
    // Remove filterOptions argument
    try {
      const { data, error } = await supabase.from('product').select('*')

      if (error) {
        return rejectWithValue(error.message)
      }

      return data as Item[]
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      } else if (typeof error === 'string') {
        return rejectWithValue(error)
      }
      return rejectWithValue('An unknown error occurred.') // Provide a default message
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
    // You can add synchronous reducers here if needed
    clearItems: (state) => {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearItems } = itemsSlice.actions
export default itemsSlice.reducer
