import { supabase, isSupabaseAvailable } from '../lib/supabase'
import { cartService } from './cartService'

class OrderService {
  constructor() {
    this.useMockData = false // 使用真实的Supabase数据库
  }

  async createOrder(orderData) {
    console.log('Creating order for user:', orderData.userId)
    
    // Check if Supabase is configured
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, using mock data')
      return this.createMockOrder(orderData)
    }
    
    try {
      // Generate order number using the database function
      const { data: orderNumberResult, error: orderNumberError } = await supabase
        .rpc('generate_order_number')
      
      if (orderNumberError) {
        console.error('Error generating order number:', orderNumberError)
        throw orderNumberError
      }
      
      const orderNumber = orderNumberResult
      
      // Create the order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: orderData.userId,
          subtotal: orderData.summary.subtotal,
          tax_amount: orderData.summary.tax,
          shipping_amount: orderData.summary.shipping,
          total_amount: orderData.summary.total,
          customer_email: orderData.shippingAddress.email,
          customer_phone: orderData.shippingAddress.phone,
          shipping_address: orderData.shippingAddress,
          payment_method: orderData.paymentMethod,
          shipping_method: orderData.shippingMethod || 'standard',
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single()

      if (orderError) {
        console.error('Error creating order:', orderError)
        throw orderError
      }

      console.log('Order created successfully:', order)

      // Create order items with enhanced product data
      const orderItemsPromises = orderData.items.map(async (item) => {
        let product = item.product
        
        // 如果没有产品数据，尝试从数据库获取
        if (!product && item.productId) {
          try {
            const { productService } = await import('./productService')
            const { data: productData } = await productService.getProductById(item.productId)
            product = productData
          } catch (error) {
            console.error('Error fetching product for order:', error)
          }
        }
        
        return {
          order_id: order.id,
          product_id: item.productId,
          product_name: product?.name || item.name || 'Unknown Product',
          product_sku: product?.sku || '',
          product_image: product?.images?.[0] || '',
          quantity: item.quantity,
          unit_price: product?.price || item.unitPrice || 0,
          total_price: (product?.price || item.unitPrice || 0) * item.quantity,
          variant_options: item.variantOptions || {}
        }
      })
      
      const orderItems = await Promise.all(orderItemsPromises)

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (orderItemsError) {
        console.error('Error creating order items:', orderItemsError)
        throw orderItemsError
      }

      console.log('Order items created successfully')

      // Clear user's cart after successful order creation
      if (orderData.userId) {
        await cartService.clearCart(orderData.userId)
      }

      return { data: order, error: null }
    } catch (error) {
      console.error('Error creating order in Supabase, falling back to mock:', error)
      return this.createMockOrder(orderData)
    }
  }

  // Mock order creation for fallback
  async createMockOrder(orderData) {
    console.log('Creating mock order for user:', orderData.userId)
    
    const mockOrderId = `ORD-${Date.now()}`
    const mockOrderNumber = this.generateOrderNumber()
    
    const mockOrder = {
      id: mockOrderId,
      order_number: mockOrderNumber,
      user_id: orderData.userId,
      subtotal: orderData.summary.subtotal,
      tax_amount: orderData.summary.tax,
      shipping_amount: orderData.summary.shipping,
      total_amount: orderData.summary.total,
      customer_email: orderData.shippingAddress.email,
      customer_phone: orderData.shippingAddress.phone,
      shipping_address: orderData.shippingAddress,
      payment_method: orderData.paymentMethod,
      shipping_method: orderData.shippingMethod || 'standard',
      status: 'pending',
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      order_items: await Promise.all(orderData.items.map(async (item) => {
        let product = item.product
        
        // 如果没有产品数据，尝试从数据库获取
        if (!product && item.productId) {
          try {
            const { productService } = await import('./productService')
            const { data: productData } = await productService.getProductById(item.productId)
            product = productData
          } catch (error) {
            console.error('Error fetching product for mock order:', error)
          }
        }
        
        return {
          id: `item-${Date.now()}-${Math.random()}`,
          product_id: item.productId,
          product_name: product?.name || item.name || 'Unknown Product',
          product_image: product?.images?.[0] || '',
          quantity: item.quantity,
          unit_price: product?.price || item.unitPrice || 0,
          total_price: (product?.price || item.unitPrice || 0) * item.quantity,
          variant_options: item.variantOptions || {},
          products: product // 保留产品数据用于显示
        }
      }))
    }
    
    // Store to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    existingOrders.push(mockOrder)
    localStorage.setItem('orders', JSON.stringify(existingOrders))
    
    console.log('Mock order stored:', mockOrder)
    
    // Clear local cart
    cartService.clearLocalCart()
    
    return { data: mockOrder, error: null }
  }

  async getOrderById(orderId, userId = null) {
    console.log('Fetching order from Supabase:', orderId)
    
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              id,
              name,
              images,
              slug,
              price
            )
          )
        `)
        .eq('id', orderId)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query.single()

      if (error) {
        // Handle case where order not found
        if (error.code === 'PGRST116') {
          console.log('Order not found:', orderId)
          return { data: null, error: null }
        }
        console.error('Error fetching order from Supabase:', error)
        return { data: null, error }
      }

      console.log('Order fetched successfully:', data)
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching order:', error)
      return { data: null, error }
    }
  }

  async getOrdersByUserId(userId) {
    console.log('Fetching orders for user:', userId)
    
    // Check if Supabase is configured
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, using localStorage')
      return this.getMockUserOrders(userId)
    }
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              id,
              name,
              images,
              slug,
              price
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders from Supabase:', error)
        throw error
      }

      console.log('Orders fetched successfully:', data)
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching user orders, falling back to localStorage:', error)
      return this.getMockUserOrders(userId)
    }
  }

  // Get orders from localStorage
  getMockUserOrders(userId) {
    console.log('Fetching orders from localStorage for user:', userId)
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const userOrders = allOrders.filter(order => order.user_id === userId)
    console.log('Found orders in localStorage:', userOrders)
    return { data: userOrders, error: null }
  }

  // Alias method for backward compatibility
  async getUserOrders(userId) {
    return this.getOrdersByUserId(userId)
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

