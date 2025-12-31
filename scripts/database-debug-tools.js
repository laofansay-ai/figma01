// 在浏览器控制台中运行这个脚本来检查 Supabase 数据

async function checkSupabaseData() {
  console.log('🔍 检查 Supabase 数据库...')
  
  // 检查是否有 supabase 客户端
  if (typeof window.supabase === 'undefined') {
    console.log('⚠️ Supabase 客户端不可用，尝试手动创建...')
    
    // 尝试从环境变量获取配置
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Supabase 配置不完整')
      console.log('请检查 .env 文件中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
      return
    }
  }
  
  try {
    // 检查产品表
    console.log('📦 检查产品表...')
    
    // 这里需要实际的 supabase 查询
    console.log('⚠️ 请在组件中添加以下代码来检查数据库:')
    console.log(`
      import { supabase } from '../lib/supabase'
      
      // 检查产品数据
      const checkProducts = async () => {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, images, price')
          .limit(5)
        
        console.log('Products:', data)
        console.log('Error:', error)
      }
      
      // 检查购物车数据
      const checkCartItems = async (userId) => {
        const { data, error } = await supabase
          .from('cart_items')
          .select(\`
            *,
            products (
              id,
              name,
              images,
              price
            )
          \`)
          .eq('user_id', userId)
        
        console.log('Cart items:', data)
        console.log('Error:', error)
      }
    `)
    
  } catch (error) {
    console.error('❌ 检查数据库时出错:', error)
  }
}

// 检查当前用户状态
function checkUserAuth() {
  console.log('👤 检查用户认证状态...')
  
  // 检查 localStorage 中的用户数据
  const userData = localStorage.getItem('supabase.auth.token')
  console.log('🔑 Auth token:', userData ? '存在' : '不存在')
  
  // 检查会话存储
  const sessionData = sessionStorage.getItem('supabase.auth.token')
  console.log('🔑 Session token:', sessionData ? '存在' : '不存在')
  
  console.log('⚠️ 请在组件中使用 useAuth hook 检查用户状态')
}

// 检查环境变量
function checkEnvironmentConfig() {
  console.log('⚙️ 检查环境配置...')
  
  // 在开发环境中检查
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    console.log('🌍 环境变量:')
    console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '已设置' : '未设置')
    console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '已设置' : '未设置')
  } else {
    console.log('⚠️ 无法访问环境变量，请在组件中检查')
  }
}

// 运行所有检查
function runDatabaseDiagnosis() {
  console.log('🚀 开始数据库诊断...')
  console.log('================================')
  
  checkEnvironmentConfig()
  console.log('================================')
  
  checkUserAuth()
  console.log('================================')
  
  checkSupabaseData()
  console.log('================================')
  
  console.log('📋 数据库诊断完成')
  console.log('如果购物车没有显示图片，可能的原因:')
  console.log('1. 用户未登录，使用的是 localStorage 而不是数据库')
  console.log('2. 数据库中的产品数据没有图片字段')
  console.log('3. cartService.js 没有正确获取产品信息')
  console.log('4. 环境变量配置错误')
}

// 导出到全局
window.databaseDebugTools = {
  checkSupabaseData,
  checkUserAuth,
  checkEnvironmentConfig,
  runDatabaseDiagnosis
}

// 运行诊断
runDatabaseDiagnosis()

console.log('🛠️ 数据库调试工具已加载')
console.log('📞 可用命令:')
console.log('- databaseDebugTools.runDatabaseDiagnosis() - 运行完整诊断')
console.log('- databaseDebugTools.checkUserAuth() - 检查用户认证')
console.log('- databaseDebugTools.checkEnvironmentConfig() - 检查环境配置')