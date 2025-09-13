import { supabase } from '../lib/supabase'
import { cartService } from './cartService'

class OrderService {
  constructor() {
    this.useMockData = true // Set to false when Supabase is configured
  }

  async createOrder(orderData) {
    if (this.useMockData) {
      console.log('Mock: Creating order for user', orderData.userId, 'with total', orderData.summary.total)
      // Simulate order creation
      const mockOrderId = `ORD-${Date.now()}`
      const mockOrderNumber = this.generateOrderNumber()
      const mockOrder = {
        id: mockOrderId,
        order_number: mockOrderNumber,
        user_id: orderData.userId,
        shipping_address: orderData.shippingAddress,
        payment_method: orderData.paymentMethod,
        items: orderData.items,
        total_amount: orderData.summary.total,
        status: 'pending',
        created_at: new Date().toISOString()
      }
      // Clear local cart after mock order creation
      cartService.clearLocalCart()
      
      // Store to localStorage for mock persistence
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      existingOrders.push(mockOrder)
      localStorage.setItem('orders', JSON.stringify(existingOrders))

      return { data: mockOrder, error: null }
    }

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.userId,
          shipping_address: orderData.shippingAddress,
          payment_method: orderData.paymentMethod,
          total_amount: orderData.summary.total,
          status: 'pending' // Initial status
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        variant_options: item.variantOptions
      }))

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (orderItemsError) throw orderItemsError

      // Clear user's cart after successful order creation
      await cartService.clearCart(orderData.userId)

      return { data: order, error: null }
    } catch (error) {
      console.error('Error creating order:', error)
      return { data: null, error }
    }
  }

  async getOrderById(orderId, userId = null) {
    if (this.useMockData) {
      console.log('Mock: Fetching order', orderId)
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const order = allOrders.find(o => o.id === orderId && (!userId || o.user_id === userId))
      return { data: order, error: order ? null : 'Order not found' }
    }

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*,
            products (id, name, images, slug)
          )
        `)
        .eq('id', orderId)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query.single()

      return { data, error }
    } catch (error) {
      console.error('Error fetching order:', error)
      return { data: null, error }
    }
  }

  async getOrdersByUserId(userId) {
    if (this.useMockData) {
      console.log('Mock: Fetching orders for user', userId)
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const userOrders = allOrders.filter(order => order.user_id === userId)
      return { data: userOrders, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*,
            products (id, name, images, slug)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      return { data: null, error }
    }
  }

  generateOrderNumber() {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    
    return `ORD-${year}${month}${day}-${random}`
  }
}

export const orderService = new OrderService()
export default orderService

