import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/utils/supabase/server'
import { AppDispatch } from '../store'

interface Invoice {
  id: string
  customer_type: 'cash' | 'credit'
  customer_name: string | null
  customer_id: string | null
  phone: number | null
  invoice_no: number | null
  invoice_date: string // Store as string (ISO format)
  discount_on_amount: number
  bill_amount: number | null
  payment_type: 'cash' | 'online_payment'
  created_at: string
}

interface InvoicesState {
  invoices: Invoice[]
  loading: boolean
  error: string | null
}

export const fetchInvoices = createAsyncThunk<
  Invoice[],
  void,
  { rejectValue: string }
>('invoices/fetchInvoices', async (_, { rejectWithValue }) => {
  try {
      const { data, error } = await supabase.from('invoices').select('*')
    if (error) {
      return rejectWithValue(error.message)
    }
    return data as Invoice[]
  } catch (error: unknown) {
    return rejectWithValue((error as Error).message || 'Failed to fetch invoices')
  }
})

const initialState: InvoicesState = {
  invoices: [],
  loading: false,
  error: null,
}

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.push(action.payload)
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices = state.invoices.map((invoice) =>
        invoice.id === action.payload.id ? action.payload : invoice
      )
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter(
        (invoice) => invoice.id !== action.payload
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false
        state.invoices = action.payload
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch invoices'
      })
  },
})

export const { addInvoice, updateInvoice, deleteInvoice } =
  invoicesSlice.actions

export const setupInvoiceRealtime = (dispatch: AppDispatch) => {
  const channel = supabase.channel('public:invoices')

  channel
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'invoices' },
      (payload) => {
        console.log('Invoice Realtime payload:', payload)
        if (payload.eventType === 'INSERT') {
          dispatch(addInvoice(payload.new as Invoice))
        } else if (payload.eventType === 'UPDATE') {
          dispatch(updateInvoice(payload.new as Invoice))
        } else if (payload.eventType === 'DELETE') {
          dispatch(deleteInvoice(payload.old.id))
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export default invoicesSlice.reducer
