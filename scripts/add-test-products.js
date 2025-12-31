// 添加测试产品数据到购物车的脚本

// 测试产品数据
const testProducts = [
  {
    id: 'test-product-1',
    name: '现代木质椅子',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
    ],
    slug: 'modern-wooden-chair',
    description: '舒适的现代木质椅子，适合任何家居环境。'
  },
  {
    id: 'test-product-2', 
    name: '简约沙发',
    price: 899.99,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'
    ],
    slug: 'minimalist-sofa',
    description: '简约设计的舒适沙发，完美融入现代家居。'
  },
  {
    id: 'test-product-3',
    name: '北欧风边桌',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop'
    ],
    slug: 'nordic-side-table',
    description: '北欧风格的简约边桌，实用且美观。'
  }
]

// 添加测试产品到购物车
function addTestProductsToCart() {
  console.log('🛍️ 添加测试产品到购物车...')
  
  const testCartItems = [
    {
      id: Date.now().toString(),
      productId: 'test-product-1',
      quantity: 2,
      variantOptions: {
        color: 'brown',
        size: 'medium'
      },
      product: testProducts[0],
      addedAt: new Date().toISOString()
    },
    {
      id: (Date.now() + 1).toString(),
      productId: 'test-product-2', 
      quantity: 1,
      variantOptions: {
        color: 'gray',
        size: 'large'
      },
      product: testProducts[1],
      addedAt: new Date().toISOString()
    }
  ]
  
  // 清空现有购物车并添加测试数据
  localStorage.setItem('ulmo_cart', JSON.stringify(testCartItems))
  
  console.log('✅ 测试产品已添加到购物车:', testCartItems)
  console.log('🔄 请刷新页面或重新打开购物车查看效果')
  
  return testCartItems
}

// 添加单个测试产品
function addSingleTestProduct(productIndex = 0) {
  if (productIndex >= testProducts.length) {
    console.error('❌ 产品索引超出范围')
    return
  }
  
  const product = testProducts[productIndex]
  const cartData = localStorage.getItem('ulmo_cart')
  const items = cartData ? JSON.parse(cartData) : []
  
  const newItem = {
    id: Date.now().toString(),
    productId: product.id,
    quantity: 1,
    variantOptions: {
      color: ['brown', 'gray', 'white'][productIndex] || 'brown',
      size: ['medium', 'large', 'small'][productIndex] || 'medium'
    },
    product: product,
    addedAt: new Date().toISOString()
  }
  
  items.push(newItem)
  localStorage.setItem('ulmo_cart', JSON.stringify(items))
  
  console.log(`✅ 已添加产品 "${product.name}" 到购物车`)
  console.log('🔄 请刷新页面查看效果')
}

// 检查购物车数据完整性
function validateCartData() {
  console.log('🔍 验证购物车数据完整性...')
  
  const cartData = localStorage.getItem('ulmo_cart')
  if (!cartData) {
    console.log('⚠️ 购物车为空')
    return false
  }
  
  try {
    const items = JSON.parse(cartData)
    let isValid = true
    
    items.forEach((item, index) => {
      console.log(`📦 检查商品 ${index + 1}:`)
      console.log(`  - ID: ${item.id}`)
      console.log(`  - 产品ID: ${item.productId}`) 
      console.log(`  - 数量: ${item.quantity}`)
      console.log(`  - 有产品信息: ${!!item.product}`)
      
      if (item.product) {
        console.log(`  - 产品名称: ${item.product.name}`)
        console.log(`  - 产品价格: $${item.product.price}`)
        console.log(`  - 有图片: ${!!(item.product.images && item.product.images.length > 0)}`)
        
        if (item.product.images && item.product.images.length > 0) {
          console.log(`  - 第一张图片: ${item.product.images[0]}`)
        } else {
          console.log('  ⚠️ 缺少图片信息')
          isValid = false
        }
      } else {
        console.log('  ❌ 缺少产品信息')
        isValid = false
      }
      
      console.log(`  - 变体选项: ${JSON.stringify(item.variantOptions)}`)
    })
    
    console.log(`\\n${isValid ? '✅' : '❌'} 购物车数据${isValid ? '完整' : '不完整'}`)
    return isValid
    
  } catch (error) {
    console.error('❌ 解析购物车数据失败:', error)
    return false
  }
}

// 修复购物车数据（为缺少产品信息的项目添加默认信息）
function fixCartData() {
  console.log('🔧 修复购物车数据...')
  
  const cartData = localStorage.getItem('ulmo_cart')
  if (!cartData) {
    console.log('⚠️ 购物车为空，无需修复')
    return
  }
  
  try {
    const items = JSON.parse(cartData)
    let fixed = false
    
    items.forEach((item, index) => {
      if (!item.product) {
        console.log(`🔧 为商品 ${index + 1} 添加默认产品信息`)
        
        // 查找对应的测试产品
        const testProduct = testProducts.find(p => p.id === item.productId)
        
        if (testProduct) {
          item.product = testProduct
          fixed = true
          console.log(`✅ 使用测试产品数据: ${testProduct.name}`)
        } else {
          // 使用默认产品信息
          item.product = {
            id: item.productId,
            name: `商品 ${item.productId}`,
            price: 99.99,
            images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'],
            slug: `product-${item.productId}`,
            description: '默认商品描述'
          }
          fixed = true
          console.log(`✅ 使用默认产品数据`)
        }
      }
    })
    
    if (fixed) {
      localStorage.setItem('ulmo_cart', JSON.stringify(items))
      console.log('✅ 购物车数据已修复')
      console.log('🔄 请刷新页面查看效果')
    } else {
      console.log('✅ 购物车数据无需修复')
    }
    
  } catch (error) {
    console.error('❌ 修复购物车数据失败:', error)
  }
}

// 导出函数到全局
window.cartTestTools = {
  addTestProductsToCart,
  addSingleTestProduct,
  validateCartData,
  fixCartData,
  testProducts
}

// 提供使用说明
console.log('🛠️ 购物车测试工具已加载')
console.log('📞 可用命令:')
console.log('- cartTestTools.addTestProductsToCart() - 添加完整测试数据')
console.log('- cartTestTools.addSingleTestProduct(0) - 添加单个测试产品(0-2)')
console.log('- cartTestTools.validateCartData() - 验证购物车数据完整性')
console.log('- cartTestTools.fixCartData() - 修复购物车数据')

// 自动检查并提供建议
if (localStorage.getItem('ulmo_cart')) {
  console.log('\\n🔍 检测到现有购物车数据，运行验证...')
  const isValid = validateCartData()
  
  if (!isValid) {
    console.log('\\n💡 建议操作:')
    console.log('1. 运行 cartTestTools.fixCartData() 修复现有数据')
    console.log('2. 或运行 cartTestTools.addTestProductsToCart() 使用完整测试数据')
  }
} else {
  console.log('\\n💡 购物车为空，建议运行:')
  console.log('cartTestTools.addTestProductsToCart()')
}