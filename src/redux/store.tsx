import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './slices/modal'
import itemReducer from './slices/ItemData'
export const store = configureStore({
    reducer: {
      modal : modalReducer,
      items : itemReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
