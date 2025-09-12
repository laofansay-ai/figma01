// Database configuration for Supabase
export const databaseConfig = {
  // Supabase connection settings
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY, // Only for server-side operations
  },

  // Database table names
  tables: {
    profiles: 'profiles',
    categories: 'categories',
    products: 'products',
    product_reviews: 'product_reviews',
    cart_items: 'cart_items',
    orders: 'orders',
    order_items: 'order_items',
    user_addresses: 'user_addresses',
    wishlists: 'wishlists',
    coupons: 'coupons',
    site_settings: 'site_settings'
  },

  // Database policies and security
  rls: {
    enabled: true,
    policies: {
      profiles: ['Users can view own profile', 'Users can update own profile'],
      cart_items: ['Users can manage own cart'],
      orders: ['Users can view own orders'],
      wishlists: ['Users can manage own wishlist'],
      user_addresses: ['Users can manage own addresses']
    }
  },

  // Connection pool settings
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  },

  // Query settings
  query: {
    timeout: 30000,
    maxRetries: 3,
    retryDelay: 1000
  }
}

// Environment validation
export const validateDatabaseConfig = () => {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]

  const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  )

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    )
  }

  // Validate URL format
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    throw new Error('Invalid Supabase URL format. Expected: https://your-project-id.supabase.co')
  }

  console.log('✅ Database configuration validated successfully')
  return true
}

// Database connection status
export const getDatabaseStatus = async () => {
  try {
    const { supabase } = await import('../lib/supabase')
    
    // Test connection by fetching a simple query
    const { data, error } = await supabase
      .from('site_settings')
      .select('key')
      .limit(1)

    if (error) {
      return {
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }

    return {
      connected: true,
      timestamp: new Date().toISOString(),
      tablesAccessible: true
    }
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

