import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // Products
  products: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    getByCategory: async (category) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    search: async (query) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      return { data, error }
    }
  },

  // Categories
  categories: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      return { data, error }
    }
  },

  // Orders
  orders: {
    create: async (orderData) => {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()
      return { data, error }
    },

    getByUserId: async (userId) => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    }
  },

  // User profiles
  profiles: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return { data, error }
    },

    update: async (userId, profileData) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single()
      return { data, error }
    }
  }
}

