// import { createClient } from '@supabase/supabase-js'

// const supabaseServer = () => {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
//   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

//   const supabase = createClient(supabaseUrl, supabaseAnonKey)
//   return supabase
// }

// export default supabaseServer

// supabaseClient.ts (or similar name)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// export const createClient = async () => {
//   // Make createClient async
//   const cookieStore = await cookies() // Await the cookies() promise

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         async getAll() {
//           // Make getAll async
//           return cookieStore.getAll() // Now you can call getAll()
//         },
//         async setAll(cookiesToSet) {
//           // Make setAll async
//           try {
//             for (const { name, value, options } of cookiesToSet) {
//               cookieStore.set(name, value, options)
//             }
//           } catch (error) {
//             // Handle error appropriately, e.g., log it
//             console.error('Error setting cookies:', error)
//           }
//         },
//       },
//     }
//   )
// }
