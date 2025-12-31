import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

// Create client only if configured, otherwise use null
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return isSupabaseConfigured && supabase !== null
}

// Auth helpers
export const auth = {
  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    if (!isSupabaseAvailable()) {
      return { data: null, error: new Error('Supabase not configured') }
    }
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
    if (!isSupabaseAvailable()) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  signOut: async () => {
    if (!isSupabaseAvailable()) {
      return { error: new Error('Supabase not configured') }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    if (!isSupabaseAvailable()) {
      return { user: null, error: new Error('Supabase not configured') }
    }
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    if (!isSupabaseAvailable()) {
      // Return a mock subscription for compatibility
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // Products
  products: {
    getAll: async () => {
      if (!isSupabaseAvailable()) {
        return { data: [], error: new Error('Supabase not configured') }
      }
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getById: async (id) => {
      if (!isSupabaseAvailable()) {
        return { data: null, error: new Error('Supabase not configured') }
      }
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    getByCategory: async (category) => {
      if (!isSupabaseAvailable()) {
        return { data: [], error: new Error('Supabase not configured') }
      }
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    search: async (query) => {
      if (!isSupabaseAvailable()) {
        return { data: [], error: new Error('Supabase not configured') }
      }
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
      if (!isSupabaseAvailable()) {
        return { data: [], error: new Error('Supabase not configured') }
      }
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
      if (!isSupabaseAvailable()) {
        return { data: null, error: new Error('Supabase not configured') }
      }
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()
      return { data, error }
    },

    getByUserId: async (userId) => {
      if (!isSupabaseAvailable()) {
        return { data: [], error: new Error('Supabase not configured') }
      }
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
      if (!isSupabaseAvailable()) {
        return { data: null, error: new Error('Supabase not configured') }
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return { data, error }
    },

    update: async (userId, profileData) => {
      if (!isSupabaseAvailable()) {
        return { data: null, error: new Error('Supabase not configured') }
      }
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

