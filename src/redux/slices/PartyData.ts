import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/utils/supabase/server' // Your Supabase client setup
import { Party } from '@/lib/type'
import { AppDispatch } from '../store'

// Define the type for your data (replace with your actual type)


interface ItemsState {
  party: Party[]
  loading: boolean
  error: string | null
}

// Async thunk for fetching items from Supabase with optional filters
export const fetchParty = createAsyncThunk(
  'party/fetchParty',
  async (_, { rejectWithValue }) => {
    // Remove filterOptions argument
    try {
      const { data, error } = await supabase.from('party').select('*')

      if (error) {
        return rejectWithValue(error.message)
      }

      return data as Party[]
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
  party: [],
  loading: false,
  error: null,
}

const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    // You can add synchronous reducers here if needed
    clearItems: (state) => {
      state.party = []
    },
    // Reducer to update a single item (used by real-time updates)
    updateItem: (state, action: PayloadAction<Party>) => {
      state.party = state.party.map((item) =>
        item.id === action.payload.id ? action.payload : item
      )
    },
    addItem: (state, action: PayloadAction<Party>) => {
      state.party.push(action.payload)
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.party = state.party.filter((item) => item.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParty.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchParty.fulfilled,
        (state, action: PayloadAction<Party[]>) => {
          state.loading = false
          state.party = action.payload
        }
      )
      .addCase(fetchParty.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearItems, updateItem, addItem, deleteItem } = partySlice.actions
// Real-time listener setup (outside the component)
export const setupPartyRealtime = (dispatch: AppDispatch) => {
  const channel = supabase.channel('public:party')

  channel
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'party' },
      (payload) => {
        console.log('Realtime payload:', payload)
        if (payload.eventType === 'UPDATE') {
          dispatch(updateItem(payload.new as Party))
        } else if (payload.eventType === 'INSERT') {
          dispatch(addItem(payload.new as Party))
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

export default partySlice.reducer
