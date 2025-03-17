// // import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
// // import { supabase } from '@/utils/supabase/server' // Your Supabase client setup
// // import { AppDispatch } from '../store'
// // import prisma from '@/lib/prisma'

// // // Define the type for your data

// // interface Category {
// //   id: string
// //   title: string | null
// // }
// // interface Sub_Category {
// //     id: string
// //     title: string
// //     category_id: string
// // }
// // interface ItemsState {
// //   category: Category[]
// //   sub_category: Sub_Category[]
// //   loading: boolean
// //   error: string | null
// // }

// // // Async thunk for fetching items from Supabase
// // interface FetchItemsResponse {
// //   category: Category[];
// //   sub_category: Sub_Category[];
// // }

// // export const fetchProperties = createAsyncThunk<
// //   FetchItemsResponse,
// //   void,
// //   { rejectValue: string }
// // >('items/fetchProperties', async (_, { rejectWithValue }) => {
// //   try {
// //     const categoryData = await prisma.category.findMany()
// //     console.log("🚀 ~ > ~ categoryData:", categoryData)

// //     // const { data: categoryData, error: categoryError } = await supabase
// //     //   .from('category')
// //     //   .select('*')

// //     const { data: subCategoryData, error: subCategoryError } = await supabase
// //       .from('sub_category')
// //       .select('*,category(*)')

// //     // if (categoryError) {
// //     //   return rejectWithValue(categoryError.message)
// //     // }
// //     if (subCategoryError) {
// //       return rejectWithValue(subCategoryError.message)
// //     }
// //     return { category: categoryData, sub_category: subCategoryData }
// //   } catch (error) {
// //     return rejectWithValue(
// //       (error as Error)?.message || 'An unknown error occurred.'
// //     )
// //   }
// // })

// // const initialState: ItemsState = {
// //   category: [],
// //   sub_category: [],
// //   loading: false,
// //   error: null,
// // }

// // const propertiesSlice = createSlice({
// //   name: 'properties',
// //   initialState,
// //   reducers: {
// //     // clearItems: (state) => {
// //     //   state.items = []
// //     // },
// //     // Reducer to update a single item (used by real-time updates)
// //     updateItem: (state, action: PayloadAction<Category>) => {
// //       state.category = state.category.map((item) =>
// //         item.id === action.payload.id ? action.payload : item
// //       )
// //       // state.sub_category should not be updated with Category payload
// //     },
// //       addItem: (state, action: PayloadAction<{ item: Category | Sub_Category; type: string }>) => {
// //           if (action.payload.type === 'category') {
// //               state.category.push(action.payload.item as Category)
// //             } else {
// //                 state.sub_category.push(action.payload.item as Sub_Category)
// //               // state.sub_category should not be updated with Category payload
// //           }
// //     },
// //     deleteItem: (state, action: PayloadAction<string>) => {
// //       state.category = state.category.filter(
// //         (item) => item.id !== action.payload
// //       )
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchProperties.pending, (state) => {
// //         state.loading = true
// //         state.error = null
// //       })
// //       .addCase(fetchProperties.fulfilled, (state, action) => {
// //         state.loading = false
// //         state.category = action.payload.category
// //         state.sub_category = action.payload.sub_category
// //       })
// //       .addCase(fetchProperties.rejected, (state, action) => {
// //         state.loading = false
// //         state.error = action.payload || 'Failed to fetch items'
// //       })
// //   },
// // })

// // export const { updateItem, addItem, deleteItem } = propertiesSlice.actions

// // // Real-time listener setup (outside the component)
// // export const setupPropertiesRealtime = (dispatch: AppDispatch) => {
// //   const Category_channel = supabase.channel('public:category')
// //   const Sub_Category_channel = supabase.channel('public:sub_category')

// //   Category_channel.on(
// //     'postgres_changes',
// //     { event: '*', schema: 'public', table: 'category' },
// //     (payload) => {
// //       console.log('Realtime payload:', payload)
// //       if (payload.eventType === 'UPDATE') {
// //         dispatch(updateItem(payload.new as Category))
// //       } else if (payload.eventType === 'INSERT') {
// //         dispatch(addItem({ item: payload.new as Category, type: 'category' }))
// //       } else if (payload.eventType === 'DELETE') {
// //         dispatch(deleteItem(payload.old.id))
// //       }
// //     }
// //   ).subscribe()
// //   Sub_Category_channel.on(
// //     'postgres_changes',
// //     { event: '*', schema: 'public', table: 'sub_category' },
// //     (payload) => {
// //       console.log('Realtime payload:', payload)
// //       if (payload.eventType === 'UPDATE') {
// //         dispatch(updateItem(payload.new as Sub_Category))
// //       } else if (payload.eventType === 'INSERT') {
// //         dispatch(addItem({ item: payload.new as Sub_Category, type: 'sub_category' }))
// //       } else if (payload.eventType === 'DELETE') {
// //         dispatch(deleteItem(payload.old.id))
// //       }
// //     }
// //   ).subscribe()

// //   return () => {
// //     supabase.removeChannel(Category_channel)
// //     supabase.removeChannel(Sub_Category_channel)
// //   }
// // }

// // export default propertiesSlice.reducer

// import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit'
// import prisma from '@/lib/prisma'

// // Define the type for your data
// interface Category {
//   id: string
//   title: string | null
// }

// interface Sub_Category {
//   id: string
//   title: string | null
//   category_id: string | null
// }

// interface ItemsState {
//   category: Category[]
//   sub_category: Sub_Category[]
//   loading: boolean
//   error: string | null
// }

// // Async Thunks for CRUD Operations
// export const fetchProperties = createAsyncThunk<
//   { category: Category[]; sub_category: Sub_Category[] },
//   void,
//   { rejectValue: string }
//   >('items/fetchProperties', async (_, { rejectWithValue }) => {

//   // console.log("🚀 ~ > ~ category:", "category")
//   try {
//     const categoryData = await prisma.category.findMany()
//     console.log("🚀 ~ > ~ categoryData:", categoryData)
//     const subCategoryData = await prisma.sub_category.findMany()
//     return { category: categoryData, sub_category: subCategoryData }
//   } catch (error) {
//     return rejectWithValue((error as Error)?.message || 'Fetch error.')
//   }
// })

// // Category CRUD
// export const createCategory = createAsyncThunk(
//   'items/createCategory',
//   async (newCategory: { title: string }, { rejectWithValue }) => {
//     try {
//       return await prisma.category.create({ data: newCategory })
//     } catch (error) {
//       return rejectWithValue((error as Error)?.message)
//     }
//   }
// )

// export const updateCategory = createAsyncThunk(
//   'items/updateCategory',
//   async (updatedCategory: Category, { rejectWithValue }) => {
//     try {
//       return await prisma.category.update({
//         where: { id: updatedCategory.id },
//         data: updatedCategory,
//       })
//     } catch (error) {
//       return rejectWithValue((error as Error)?.message)
//     }
//   }
// )

// export const deleteCategory = createAsyncThunk(
//   'items/deleteCategory',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await prisma.category.delete({ where: { id } })
//       return id
//     } catch (error) {
//       return rejectWithValue((error as Error)?.message)
//     }
//   }
// )

// // Sub_Category CRUD
// export const createSubCategory = createAsyncThunk(
//   'items/createSubCategory',
//   async (
//     newSubCategory: { title: string; category_id: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       return await prisma.sub_category.create({ data: newSubCategory })
//     } catch (error) {
//       return rejectWithValue((error as Error)?.message)
//     }
//   }
// )

// export const updateSubCategory = createAsyncThunk(
//   'items/updateSubCategory',
//   async (updatedSubCategory: Sub_Category, { rejectWithValue }) => {
//     try {
//       return await prisma.sub_category.update({
//         where: { id: updatedSubCategory.id },
//         data: updatedSubCategory,
//       })
//     } catch (error) {
//       return rejectWithValue((error as Error)?.message)
//     }
//   }
// )

// export const deleteSubCategory = createAsyncThunk(
//   'items/deleteSubCategory',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await prisma.sub_category.delete({ where: { id } })
//       return id
//     } catch (error) {
//       return rejectWithValue((error as Error)?.message)
//     }
//   }
// )

// const initialState: ItemsState = {
//   category: [],
//   sub_category: [],
//   loading: false,
//   error: null,
// }

// const propertiesSlice = createSlice({
//   name: 'properties',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProperties.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(fetchProperties.fulfilled, (state, action) => {
//         state.loading = false
//         state.category = action.payload.category
//         state.sub_category = action.payload.sub_category
//       })
//       .addCase(fetchProperties.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload || 'Fetch failed'
//       })
//       .addCase(createCategory.fulfilled, (state, action) => {
//         state.category.push(action.payload)
//       })
//       .addCase(updateCategory.fulfilled, (state, action) => {
//         state.category = state.category.map((cat) =>
//           cat.id === action.payload.id ? action.payload : cat
//         )
//       })
//       .addCase(deleteCategory.fulfilled, (state, action) => {
//         state.category = state.category.filter(
//           (cat) => cat.id !== action.payload
//         )
//       })
//       .addCase(createSubCategory.fulfilled, (state, action) => {
//         state.sub_category.push(action.payload)
//       })
//       .addCase(updateSubCategory.fulfilled, (state, action) => {
//         state.sub_category = state.sub_category.map((sub) =>
//           sub.id === action.payload.id ? action.payload : sub
//         )
//       })
//       .addCase(deleteSubCategory.fulfilled, (state, action) => {
//         state.sub_category = state.sub_category.filter(
//           (sub) => sub.id !== action.payload
//         )
//       })
//   },
// })

// export default propertiesSlice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { useQuery } from '@tanstack/react-query'

const fetchProperties = async() => {
  try {
    // const data = useQuery({
    //   queryKey: ['properties'],
    //   queryFn: async () => {
    //     const res = await fetch('/api/properties')
    //     if (!res.ok) throw new Error('Failed to fetch properties')
    //     return res.json()
    //   },
    //   staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    // })
    // console.log("🚀 ~ fetchProperties ~ data:", data)
    return
  } catch (error) {
    console.log('🚀 ~ fetchProperties ~ error:', error)
  }

  const res = await fetch('/api/properties')
  if (!res.ok) throw new Error('Failed to fetch properties')
  return res.json() // Returns { category: [...], sub_category: [...] }
}

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })
}
// export const fetchProperties = createAsyncThunk(
//   'items/fetchProperties',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await fetch('/api/properties') // Calls API route
//       if (!res.ok) throw new Error('Failed to fetch properties')
//       return await res.json()
//     } catch (error) {
//       return rejectWithValue((error as Error).message)
//     }
//   }
// )

// CRUD Operations using API
export const createCategory = createAsyncThunk(
  'items/createCategory',
  async (newCategory: { title: string }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify(newCategory),
      })
      return await res.json()
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

// Other CRUD functions are similar: updateCategory, deleteCategory, createSubCategory, etc.

const initialState = {
  category: [],
  sub_category: [],
  loading: false,
  error: '',
}

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {},
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchProperties.pending, (state) => {
  //       state.loading = true
  //     })
  //     .addCase(fetchProperties.fulfilled, (state, action) => {
  //       state.loading = false
  //       state.category = action.payload.category
  //       state.sub_category = action.payload.sub_category
  //     })
  //     .addCase(fetchProperties.rejected, (state, action) => {
  //       state.loading = false
  //       state.error = action.payload ? String(action.payload) : 'Fetch failed'
  //     })
  // },
})

export default propertiesSlice.reducer
