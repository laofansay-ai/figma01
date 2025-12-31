// 测试购物车和订单图片显示的脚本
// 这个脚本可以在浏览器控制台中运行来测试功能

console.log('🧪 开始测试购物车和订单图片显示功能...')

// 测试购物车数据结构
function testCartDataStructure() {
  console.log('\n📋 测试购物车数据结构...')
  
  const testCartItem = {
    id: 'test-1',
    productId: 'product-uuid-1',
    quantity: 2,
    variantOptions: { color: 'brown', size: 'medium' },
    product: {
      id: 'product-uuid-1',
      name: 'Modern Wooden Chair',
      price: 299.99,
      images: ['https://example.com/chair1.jpg', 'https://example.com/chair2.jpg'],
      slug: 'modern-wooden-chair'
    }
  }
  
  console.log('✓ 测试数据结构:', testCartItem)
  
  // 测试价格计算
  const unitPrice = testCartItem.product?.price || 0
  const totalPrice = unitPrice * testCartItem.quantity
  
  console.log(`✓ 单价: $${unitPrice.toFixed(2)}`)
  console.log(`✓ 总价: $${totalPrice.toFixed(2)}`)
  console.log(`✓ 图片: ${testCartItem.product?.images?.[0] || '无图片'}`)
  
  return true
}

// 测试订单数据结构
function testOrderDataStructure() {
  console.log('\n📋 测试订单数据结构...')
  
  const testOrder = {
    id: 'order-uuid-1',
    order_number: 'ORD-20250912-1234',
    status: 'pending',
    total_amount: 659.98,
    order_items: [
      {
        id: 'item-uuid-1',
        product_id: 'product-uuid-1',
        product_name: 'Modern Wooden Chair',
        product_image: 'https://example.com/chair1.jpg',
        quantity: 2,
        unit_price: 299.99,
        total_price: 599.98,
        products: {
          id: 'product-uuid-1',
          name: 'Modern Wooden Chair',
          images: ['https://example.com/chair1.jpg']
        }
      }
    ]
  }
  
  console.log('✓ 测试订单数据:', testOrder)
  
  // 测试订单项图片显示
  const orderItem = testOrder.order_items[0]
  const productImage = orderItem.product_image || orderItem.products?.images?.[0] || '/api/placeholder/48/48'
  const productName = orderItem.product_name || orderItem.products?.name || 'Product'
  
  console.log(`✓ 商品名称: ${productName}`)
  console.log(`✓ 商品图片: ${productImage}`)
  console.log(`✓ 数量: ${orderItem.quantity}`)
  console.log(`✓ 单价: $${orderItem.unit_price}`)
  
  return true
}

// 检查localStorage中的购物车数据
function checkLocalStorageCart() {
  console.log('\n💾 检查localStorage购物车数据...')
  
  const cartData = localStorage.getItem('ulmo_cart')
  if (cartData) {
    try {
      const items = JSON.parse(cartData)
      console.log('✓ 本地购物车数据:', items)
      console.log(`✓ 商品数量: ${items.length}`)
      
      items.forEach((item, index) => {
        console.log(`商品 ${index + 1}:`, {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          variantOptions: item.variantOptions
        })
      })
    } catch (error) {
      console.error('❌ 解析购物车数据失败:', error)
    }
  } else {
    console.log('⚠️ 本地购物车为空')
  }
}

// 检查localStorage中的订单数据
function checkLocalStorageOrders() {
  console.log('\n💾 检查localStorage订单数据...')
  
  const ordersData = localStorage.getItem('orders')
  if (ordersData) {
    try {
      const orders = JSON.parse(ordersData)
      console.log('✓ 本地订单数据:', orders)
      console.log(`✓ 订单数量: ${orders.length}`)
      
      orders.forEach((order, index) => {
        console.log(`订单 ${index + 1}:`, {
          id: order.id,
          order_number: order.order_number,
          status: order.status,
          total_amount: order.total_amount,
          items_count: order.order_items?.length || 0
        })
        
        // 检查订单项的图片信息
        if (order.order_items) {
          order.order_items.forEach((item, itemIndex) => {
            console.log(`  商品 ${itemIndex + 1}:`, {
              name: item.product_name,
              image: item.product_image,
              hasProductData: !!item.products
            })
          })
        }
      })
    } catch (error) {
      console.error('❌ 解析订单数据失败:', error)
    }
  } else {
    console.log('⚠️ 本地订单为空')
  }
}

// 运行所有测试
function runAllTests() {
  console.log('🚀 开始运行所有测试...')
  
  try {
    testCartDataStructure()
    testOrderDataStructure()
    checkLocalStorageCart()
    checkLocalStorageOrders()
    
    console.log('\n✅ 所有测试完成!')
    console.log('\n📋 检查清单:')
    console.log('1. 购物车页面是否显示商品图片? ')
    console.log('2. 购物车页面是否显示正确的价格?')
    console.log('3. 订单详情页面是否显示商品图片?')
    console.log('4. 下单时是否正确保存商品信息?')
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

// 导出测试函数，可以在控制台中调用
window.testCartAndOrderImages = {
  runAllTests,
  testCartDataStructure,
  testOrderDataStructure,
  checkLocalStorageCart,
  checkLocalStorageOrders
}

// 自动运行测试
runAllTests()