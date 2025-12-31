import { supabase, isSupabaseAvailable } from '../lib/supabase.js'

/**
 * 修复 RLS 策略的工具
 */
export async function fixRLSPolicies() {
  console.log('🔧 开始修复 RLS 策略...')
  
  if (!isSupabaseAvailable()) {
    console.error('❌ Supabase 未配置或不可用')
    return false
  }

  try {
    // 修复 orders 表的 INSERT 策略
    console.log('📝 添加 orders 表的 INSERT 策略...')
    const { error: ordersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Users can create own orders" 
          ON orders FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
      `
    })

    if (ordersError && !ordersError.message.includes('already exists')) {
      console.error('❌ 创建 orders INSERT 策略失败:', ordersError)
      return false
    }

    // 修复 order_items 表的 INSERT 策略
    console.log('📝 添加 order_items 表的 INSERT 策略...')
    const { error: orderItemsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Users can create order items for own orders" 
          ON order_items FOR INSERT 
          WITH CHECK (
            EXISTS (
              SELECT 1 FROM orders 
              WHERE orders.id = order_items.order_id 
              AND orders.user_id = auth.uid()
            )
          );
      `
    })

    if (orderItemsError && !orderItemsError.message.includes('already exists')) {
      console.error('❌ 创建 order_items INSERT 策略失败:', orderItemsError)
      return false
    }

    console.log('✅ RLS 策略修复成功!')
    return true

  } catch (error) {
    console.error('❌ 修复 RLS 策略时发生错误:', error)
    return false
  }
}

/**
 * 测试订单创建功能
 */
export async function testOrderCreation() {
  console.log('🧪 测试订单创建功能...')
  
  if (!isSupabaseAvailable()) {
    console.error('❌ Supabase 未配置或不可用')
    return false
  }

  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('❌ 获取用户信息失败:', userError)
      return false
    }

    console.log('👤 当前用户:', user.email)

    // 生成订单号
    const { data: orderNumber, error: orderNumberError } = await supabase
      .rpc('generate_order_number')

    if (orderNumberError) {
      console.error('❌ 生成订单号失败:', orderNumberError)
      return false
    }

    console.log('🔢 生成的订单号:', orderNumber)

    // 创建测试订单
    const testOrder = {
      order_number: orderNumber,
      user_id: user.id,
      subtotal: 99.99,
      tax_amount: 8.00,
      shipping_amount: 15.00,
      total_amount: 122.99,
      customer_email: user.email,
      customer_phone: '123-456-7890',
      shipping_address: {
        first_name: 'Test',
        last_name: 'User',
        address_line_1: '123 Test Street',
        city: 'Test City',
        state: 'CA',
        postal_code: '12345',
        country: 'US'
      },
      payment_method: 'credit_card',
      shipping_method: 'standard',
      status: 'pending',
      payment_status: 'pending'
    }

    console.log('📦 创建测试订单...')
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select()
      .single()

    if (orderError) {
      console.error('❌ 创建订单失败:', orderError)
      return false
    }

    console.log('✅ 订单创建成功:', order)

    // 创建测试订单项
    const testOrderItem = {
      order_id: order.id,
      product_id: '550e8400-e29b-41d4-a716-446655440001', // 使用默认产品ID
      product_name: 'Test Product',
      product_sku: 'TEST-001',
      product_image: '/images/test-product.jpg',
      quantity: 1,
      unit_price: 99.99,
      total_price: 99.99,
      variant_options: {}
    }

    console.log('📋 创建测试订单项...')
    const { data: orderItem, error: orderItemError } = await supabase
      .from('order_items')
      .insert(testOrderItem)
      .select()
      .single()

    if (orderItemError) {
      console.error('❌ 创建订单项失败:', orderItemError)
      return false
    }

    console.log('✅ 订单项创建成功:', orderItem)

    // 清理测试数据
    console.log('🧹 清理测试数据...')
    await supabase.from('order_items').delete().eq('order_id', order.id)
    await supabase.from('orders').delete().eq('id', order.id)

    console.log('✅ 测试完成，所有功能正常!')
    return true

  } catch (error) {
    console.error('❌ 测试订单创建时发生错误:', error)
    return false
  }
}

// 导出主要功能
export default {
  fixRLSPolicies,
  testOrderCreation
}