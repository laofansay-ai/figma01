/**
 * Supabase连接测试工具
 * 用于验证环境变量配置和数据库连接
 */

import { supabase, isSupabaseAvailable } from '../lib/supabase.js'

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase configuration...')
  
  // 检查环境变量
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('Environment variables:')
  console.log('- VITE_SUPABASE_URL:', url ? '✅ Configured' : '❌ Missing')
  console.log('- VITE_SUPABASE_ANON_KEY:', key ? '✅ Configured' : '❌ Missing')
  
  if (!isSupabaseAvailable()) {
    console.log('❌ Supabase not available')
    return { success: false, message: 'Supabase not configured' }
  }
  
  try {
    // 测试基本连接
    console.log('🔗 Testing basic connection...')
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Database connection failed:', error.message)
      return { success: false, message: error.message }
    }
    
    console.log('✅ Database connection successful')
    console.log('📊 Sample data:', data)
    
    return { success: true, message: 'Supabase connection working' }
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return { success: false, message: error.message }
  }
}

// 如果直接在浏览器控制台中运行
if (typeof window !== 'undefined') {
  window.testSupabaseConnection = testSupabaseConnection
  console.log('💡 Run testSupabaseConnection() in console to test connection')
}