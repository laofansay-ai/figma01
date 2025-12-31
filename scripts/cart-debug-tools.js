// 购物车图片调试工具 - 在浏览器控制台中运行

// 1. 检查购物车数据结构
function debugCartData() {
  console.log('🔍 购物车数据调试开始...')
  
  // 检查 localStorage 中的购物车数据
  const cartData = localStorage.getItem('ulmo_cart')
  console.log('📦 localStorage 购物车数据:', cartData)
  
  if (cartData) {
    try {
      const items = JSON.parse(cartData)
      console.log('✅ 解析后的购物车项目:', items)
      
      items.forEach((item, index) => {
        console.log(`🛍️ 商品 ${index + 1}:`, {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          variantOptions: item.variantOptions,
          addedAt: item.addedAt
        })
      })
    } catch (error) {
      console.error('❌ 解析购物车数据失败:', error)
    }
  } else {
    console.log('⚠️ localStorage 中没有购物车数据')
  }
}

// 2. 检查 CartContext 状态
function debugCartContext() {
  console.log('🔍 CartContext 状态调试...')
  
  // 这需要在 React 组件中运行
  console.log('⚠️ 请在购物车组件中添加以下代码来调试:')
  console.log(`
    useEffect(() => {
      console.log('CartContext items:', items)
      console.log('CartContext summary:', summary)
      console.log('CartContext loading:', loading)
    }, [items, summary, loading])
  `)
}

// 3. 测试添加商品到购物车
async function testAddProduct() {
  console.log('🧪 测试添加商品到购物车...')
  
  // 检查是否有 addToCart 函数可用
  if (typeof window.testAddToCart === 'function') {
    await window.testAddToCart()
  } else {
    console.log('⚠️ 请确保在购物车页面运行此测试')
    console.log('或者手动添加商品到购物车后再检查数据')
  }
}

// 4. 检查图片 URL 可访问性
function checkImageUrls() {
  console.log('🖼️ 检查图片 URL 可访问性...')
  
  const cartData = localStorage.getItem('ulmo_cart')
  if (!cartData) {
    console.log('⚠️ 没有购物车数据可检查')
    return
  }
  
  try {
    const items = JSON.parse(cartData)
    items.forEach((item, index) => {
      if (item.image) {
        console.log(`🔗 商品 ${index + 1} 图片 URL:`, item.image)
        
        // 测试图片是否可访问
        const img = new Image()
        img.onload = () => console.log(`✅ 图片 ${index + 1} 加载成功`)
        img.onerror = () => console.log(`❌ 图片 ${index + 1} 加载失败`)
        img.src = item.image
      } else {
        console.log(`⚠️ 商品 ${index + 1} 没有图片 URL`)
      }
    })
  } catch (error) {
    console.error('❌ 检查图片时出错:', error)
  }
}

// 5. 模拟添加测试商品
function addTestProduct() {
  console.log('🎯 添加测试商品到购物车...')
  
  const testProduct = {
    id: `test-${Date.now()}`,
    productId: 'test-product-1',
    quantity: 1,
    variantOptions: {
      color: 'brown',
      size: 'medium'
    },
    addedAt: new Date().toISOString()
  }
  
  const existingCart = localStorage.getItem('ulmo_cart')
  const cartItems = existingCart ? JSON.parse(existingCart) : []
  cartItems.push(testProduct)
  
  localStorage.setItem('ulmo_cart', JSON.stringify(cartItems))
  console.log('✅ 测试商品已添加:', testProduct)
  console.log('🔄 请刷新页面查看效果')
}

// 6. 清空购物车
function clearTestCart() {
  localStorage.removeItem('ulmo_cart')
  console.log('🗑️ 购物车已清空')
  console.log('🔄 请刷新页面查看效果')
}

// 7. 运行完整诊断
function runFullDiagnosis() {
  console.log('🚀 开始完整诊断...')
  console.log('===========================')
  
  debugCartData()
  console.log('===========================')
  
  debugCartContext()
  console.log('===========================')
  
  checkImageUrls()
  console.log('===========================')
  
  console.log('📋 诊断建议:')
  console.log('1. 如果 localStorage 中有数据但页面没显示，可能是 CartContext 加载问题')
  console.log('2. 如果图片 URL 无法访问，需要检查图片源')
  console.log('3. 如果数据结构不完整，需要检查 cartService.js 的数据获取逻辑')
  console.log('4. 可以使用 addTestProduct() 添加测试数据')
  console.log('5. 可以使用 clearTestCart() 清空购物车')
}

// 导出到全局，方便在控制台调用
window.cartDebugTools = {
  debugCartData,
  debugCartContext,
  testAddProduct,
  checkImageUrls,
  addTestProduct,
  clearTestCart,
  runFullDiagnosis
}

// 自动运行诊断
runFullDiagnosis()

console.log('🛠️ 购物车调试工具已加载')
console.log('📞 可用命令:')
console.log('- cartDebugTools.runFullDiagnosis() - 运行完整诊断')
console.log('- cartDebugTools.addTestProduct() - 添加测试商品')
console.log('- cartDebugTools.clearTestCart() - 清空购物车')
console.log('- cartDebugTools.debugCartData() - 检查购物车数据')
console.log('- cartDebugTools.checkImageUrls() - 检查图片URL')