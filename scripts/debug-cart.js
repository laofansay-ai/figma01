// 购物车调试脚本
// 在浏览器控制台中运行此脚本来调试购物车问题

console.log('🛒 开始调试购物车功能...')

// 1. 检查 localStorage 中的购物车数据
console.log('1. 检查 localStorage 购物车数据:')
const cartData = localStorage.getItem('ulmo_cart')
if (cartData) {
  try {
    const items = JSON.parse(cartData)
    console.log('   购物车原始数据:', items)
    console.log('   商品数量:', items.length)
  } catch (error) {
    console.log('   ❌ 购物车数据解析失败:', error)
  }
} else {
  console.log('   ℹ️ localStorage 中没有购物车数据')
}

// 2. 测试 mockProducts 数据
console.log('2. 测试 mockProducts 数据:')
try {
  // 模拟导入 mockProducts
  console.log('   尝试访问产品ID 1...')
  
  // 你可以在这里手动检查产品ID
  const testProductIds = [1, 2, 3, 4, 5]
  testProductIds.forEach(id => {
    console.log(`   产品ID ${id}:`, `模拟检查`)
  })
} catch (error) {
  console.log('   ❌ mockProducts 访问失败:', error)
}

// 3. 测试添加产品到购物车
console.log('3. 模拟添加产品到购物车:')
const testCartItem = {
  id: Date.now().toString(),
  productId: 1,
  quantity: 1,
  variantOptions: { color: 'brown', size: 'medium' },
  addedAt: new Date().toISOString()
}

try {
  // 获取当前购物车
  const currentCart = localStorage.getItem('ulmo_cart')
  const items = currentCart ? JSON.parse(currentCart) : []
  
  // 添加测试商品
  items.push(testCartItem)
  
  // 保存到 localStorage
  localStorage.setItem('ulmo_cart', JSON.stringify(items))
  
  console.log('   ✅ 测试商品已添加到 localStorage')
  console.log('   新的购物车数据:', JSON.parse(localStorage.getItem('ulmo_cart')))
} catch (error) {
  console.log('   ❌ 添加商品失败:', error)
}

// 4. 检查 CartContext 状态
console.log('4. CartContext 状态检查:')
console.log('   请在 React 组件中检查以下内容:')
console.log('   • useCart() 返回的 items 数组')
console.log('   • getItemCount() 函数结果')
console.log('   • summary 对象中的 itemCount')

// 5. 提供修复建议
console.log('5. 修复建议:')
console.log('   ✅ 确保 ProductDetail 使用正确的产品ID')
console.log('   ✅ 确保 addToCart 函数传递 productId 而不是整个 product 对象')
console.log('   ✅ 确保 getLocalCartItems 正确获取和丰富产品数据')
console.log('   ✅ 确保 CartContext 正确加载 localStorage 数据')

console.log('🎉 购物车调试完成！')
console.log('💡 如果购物车仍然为空，请检查:')
console.log('   1. CartContext 是否正确初始化')
console.log('   2. cartService.getLocalCartItems() 是否正确工作')
console.log('   3. productService.getProductById() 是否返回有效产品')