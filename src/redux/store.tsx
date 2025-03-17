import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './slices/modal'
import itemReducer from './slices/ItemData'
import partyReducer from './slices/PartyData'
import saleItemsReducer from './slices/saleItem'
import invoicesReducer from './slices/InvoiceData'
import propertiesReducer from './slices/PropertiesData'
export const store = configureStore({
  reducer: {
    modal: modalReducer,
    items: itemReducer,
    party: partyReducer,
    saleItems: saleItemsReducer,
    invoices: invoicesReducer,
    properties: propertiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables serialization checks
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
