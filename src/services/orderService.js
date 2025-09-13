/**
 * Order Service
 * 处理订单相关的业务逻辑
 */

import { supabase } from '../lib/supabase'

class OrderService {
  constructor() {
    this.useMockData = true // 设置为false时使用真实API
  }

  /**
   * 创建新订单
   */
  async createOrder(orderData) {
    if (this.useMockData) {
      return this.createMockOrder(orderData)
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          user_id: orderData.userId,
          subtotal: orderData.summary.subtotal,
          tax_amount: orderData.summary.tax,
          shipping_amount: orderData.summary.shipping,
          total_amount: orderData.summary.total,
          customer_email: orderData.shippingAddress.email,
          customer_phone: orderData.shippingAddress.phone,
          shipping_address: orderData.shippingAddress,
          payment_method: orderData.paymentMethod,
          shipping_method: orderData.shippingMethod,
          status: 'pending',
          payment_status: 'pending'
        }])
        .select()
        .single()

      if (error) throw error

      // 创建订单商品记录
      const orderItems = orderData.items.map(item => ({
        order_id: data.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
        variant_options: item.variantOptions
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      return { data, error: null }
    } catch (error) {
      console.error('Error creating order:', error)
      return { data: null, error }
    }
  }

  /**
   * 模拟订单创建
   */
  async createMockOrder(orderData) {
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const orderId = `ORD-${Date.now()}`
      const orderNumber = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
      
      const order = {
        id: orderId,
        order_number: orderNumber,
        user_id: orderData.userId,
        status: 'pending',
        payment_status: 'pending',
        subtotal: orderData.summary.subtotal,
        tax_amount: orderData.summary.tax,
        shipping_amount: orderData.summary.shipping,
        total_amount: orderData.summary.total,
        customer_email: orderData.shippingAddress.email,
        customer_phone: orderData.shippingAddress.phone,
        shipping_address: orderData.shippingAddress,
        payment_method: orderData.paymentMethod,
        shipping_method: orderData.shippingMethod,
        created_at: new Date().toISOString(),
        items: orderData.items
      }

      // 存储到localStorage作为模拟持久化
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      existingOrders.push(order)
      localStorage.setItem('orders', JSON.stringify(existingOrders))

      console.log('Mock order created:', order)
      
      return { data: order, error: null }
    } catch (error) {
      console.error('Error creating mock order:', error)
      return { data: null, error }
    }
  }

  /**
   * 获取用户订单列表
   */
  async getUserOrders(userId) {
    if (this.useMockData) {
      return this.getMockUserOrders(userId)
    }

    try {
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

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      return { data: null, error }
    }
  }

  /**
   * 模拟获取用户订单
   */
  async getMockUserOrders(userId) {
    try {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const userOrders = allOrders.filter(order => order.user_id === userId)
      
      return { data: userOrders, error: null }
    } catch (error) {
      console.error('Error fetching mock user orders:', error)
      return { data: null, error }
    }
  }

  /**
   * 获取订单详情
   */
  async getOrderById(orderId) {
    if (this.useMockData) {
      return this.getMockOrderById(orderId)
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('id', orderId)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching order:', error)
      return { data: null, error }
    }
  }

  /**
   * 模拟获取订单详情
   */
  async getMockOrderById(orderId) {
    try {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const order = allOrders.find(order => order.id === orderId)
      
      if (!order) {
        return { data: null, error: new Error('Order not found') }
      }
      
      return { data: order, error: null }
    } catch (error) {
      console.error('Error fetching mock order:', error)
      return { data: null, error }
    }
  }

  /**
   * 更新订单状态
   */
  async updateOrderStatus(orderId, status) {
    if (this.useMockData) {
      return this.updateMockOrderStatus(orderId, status)
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating order status:', error)
      return { data: null, error }
    }
  }

  /**
   * 模拟更新订单状态
   */
  async updateMockOrderStatus(orderId, status) {
    try {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const orderIndex = allOrders.findIndex(order => order.id === orderId)
      
      if (orderIndex === -1) {
        return { data: null, error: new Error('Order not found') }
      }
      
      allOrders[orderIndex].status = status
      allOrders[orderIndex].updated_at = new Date().toISOString()
      
      localStorage.setItem('orders', JSON.stringify(allOrders))
      
      return { data: allOrders[orderIndex], error: null }
    } catch (error) {
      console.error('Error updating mock order status:', error)
      return { data: null, error }
    }
  }

  /**
   * 取消订单
   */
  async cancelOrder(orderId) {
    return this.updateOrderStatus(orderId, 'cancelled')
  }

  /**
   * 计算订单统计信息
   */
  calculateOrderSummary(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
    const taxRate = 0.08 // 8%
    const shippingRate = 15.00
    const freeShippingThreshold = 100.00
    
    const tax = subtotal * taxRate
    const shipping = subtotal >= freeShippingThreshold ? 0 : shippingRate
    const total = subtotal + tax + shipping

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      qualifiesForFreeShipping: subtotal >= freeShippingThreshold
    }
  }

  /**
   * 生成订单号
   */
  generateOrderNumber() {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    
    return `ORD-${year}${month}${day}-${random}`
  }
}

// 创建单例实例
export const orderService = new OrderService()
export default orderService