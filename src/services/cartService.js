import { supabase } from '../lib/supabase'
import { productService } from './productService'

class CartService {
  constructor() {
    this.useMockData = false // 使用真实的 Supabase 数据库
    this.storageKey = 'ulmo_cart'
  }

  // Get cart items
  async getCartItems(userId = null) {
    if (this.useMockData || !userId) {
      // Use localStorage for guest users or mock mode
      return this.getLocalCartItems()
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            slug,
            price,
            images,
            inventory_quantity
          )
        `)
        .eq('user_id', userId)

      if (error) throw error

      return { data: this.formatCartItems(data), error: null }
    } catch (error) {
      console.error('Error fetching cart items:', error)
      return { data: [], error }
    }
  }

  // Add item to cart
  async addToCart(productId, quantity = 1, variantOptions = {}, userId = null) {
    if (this.useMockData || !userId) {
      return this.addToLocalCart(productId, quantity, variantOptions)
    }

    try {
      // Check if item already exists
      const { data: existingItem, error: existingError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('variant_options', JSON.stringify(variantOptions))
        .maybeSingle()  // 使用 maybeSingle() 来避免 PGRST116 错误

      if (existingError) {
        console.error('Error checking existing cart item:', existingError)
        throw existingError
      }

      if (existingItem) {
        // Update quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select()
          .maybeSingle()  // 使用 maybeSingle() 避免 PGRST116 错误

        return { data, error }
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity,
            variant_options: variantOptions
          })
          .select()
          .maybeSingle()  // 使用 maybeSingle() 避免 PGRST116 错误

        return { data, error }
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { data: null, error }
    }
  }

  // Update cart item quantity
  async updateCartItem(itemId, quantity, userId = null) {
    if (this.useMockData || !userId) {
      return this.updateLocalCartItem(itemId, quantity)
    }

    try {
      if (quantity <= 0) {
        return this.removeFromCart(itemId, userId)
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', userId)
        .select()
        .maybeSingle()  // 使用 maybeSingle() 避免 PGRST116 错误

      return { data, error }
    } catch (error) {
      console.error('Error updating cart item:', error)
      return { data: null, error }
    }
  }

  // Remove item from cart
  async removeFromCart(itemId, userId = null) {
    if (this.useMockData || !userId) {
      return this.removeFromLocalCart(itemId)
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId)

      return { data: { success: true }, error }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { data: null, error }
    }
  }

  // Clear cart
  async clearCart(userId = null) {
    if (this.useMockData || !userId) {
      return this.clearLocalCart()
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)

      return { data: { success: true }, error }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { data: null, error }
    }
  }

  // Local storage methods for guest users
  async getLocalCartItems() {
    try {
      const cartData = localStorage.getItem(this.storageKey)
      const items = cartData ? JSON.parse(cartData) : []
      
      // 导入 productService 来获取产品数据
      const { productService } = await import('./productService')
      
      // Enrich with product data
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          try {
            // 获取产品详细信息
            const { data: product } = await productService.getProductById(item.productId)
            
            return {
              id: item.id,
              productId: item.productId,
              product_id: item.productId, // 为了兼容性
              quantity: item.quantity,
              variantOptions: item.variantOptions || {},
              variant_options: item.variantOptions || {},
              product: product,
              products: product, // 为了兼容数据库结构
              unitPrice: product?.price || 0,
              unit_price: product?.price || 0,
              totalPrice: (product?.price || 0) * item.quantity,
              total_price: (product?.price || 0) * item.quantity
            }
          } catch (error) {
            console.error(`Error fetching product ${item.productId}:`, error)
            // 如果获取产品失败，返回基本信息
            return {
              id: item.id,
              productId: item.productId,
              product_id: item.productId,
              quantity: item.quantity,
              variantOptions: item.variantOptions || {},
              variant_options: item.variantOptions || {},
              product: null,
              products: null,
              unitPrice: 0,
              unit_price: 0,
              totalPrice: 0,
              total_price: 0
            }
          }
        })
      )

      console.log('getLocalCartItems result:', {
        rawItems: items,
        enrichedItems,
        storageKey: this.storageKey
      })

      return { data: enrichedItems, error: null }
    } catch (error) {
      console.error('Error getting local cart items:', error)
      return { data: [], error }
    }
  }

  async addToLocalCart(productId, quantity, variantOptions = {}) {
    try {
      // 获取产品信息并存储到本地购物车
      let productInfo = null
      try {
        const { productService } = await import('./productService')
        const { data: product } = await productService.getProductById(productId)
        if (product) {
          productInfo = {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            slug: product.slug
          }
        }
      } catch (error) {
        console.error('获取产品信息失败:', error)
      }
      
      const cartData = localStorage.getItem(this.storageKey)
      const items = cartData ? JSON.parse(cartData) : []
      
      // Check if item already exists
      const existingItemIndex = items.findIndex(item => 
        item.productId === productId && 
        JSON.stringify(item.variantOptions) === JSON.stringify(variantOptions)
      )

      if (existingItemIndex >= 0) {
        // Update quantity
        items[existingItemIndex].quantity += quantity
        // 更新产品信息（如果有）
        if (productInfo) {
          items[existingItemIndex].product = productInfo
        }
      } else {
        // Add new item
        const newItem = {
          id: Date.now().toString(),
          productId,
          quantity,
          variantOptions,
          addedAt: new Date().toISOString()
        }
        
        // 添加产品信息（如果有）
        if (productInfo) {
          newItem.product = productInfo
        }
        
        items.push(newItem)
      }

      localStorage.setItem(this.storageKey, JSON.stringify(items))
      console.log('商品已添加到本地购物车:', { productId, quantity, productInfo })
      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error adding to local cart:', error)
      return { data: null, error }
    }
  }

  updateLocalCartItem(itemId, quantity) {
    try {
      const cartData = localStorage.getItem(this.storageKey)
      const items = cartData ? JSON.parse(cartData) : []
      
      const itemIndex = items.findIndex(item => item.id === itemId)
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          items.splice(itemIndex, 1)
        } else {
          items[itemIndex].quantity = quantity
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(items))
      }

      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error updating local cart item:', error)
      return { data: null, error }
    }
  }

  removeFromLocalCart(itemId) {
    try {
      const cartData = localStorage.getItem(this.storageKey)
      const items = cartData ? JSON.parse(cartData) : []
      
      const filteredItems = items.filter(item => item.id !== itemId)
      localStorage.setItem(this.storageKey, JSON.stringify(filteredItems))

      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error removing from local cart:', error)
      return { data: null, error }
    }
  }

  clearLocalCart() {
    try {
      localStorage.removeItem(this.storageKey)
      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error clearing local cart:', error)
      return { data: null, error }
    }
  }

  // Calculate cart summary
  calculateCartSummary(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    
    // Mock tax and shipping calculations
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
      itemCount,
      freeShippingThreshold,
      qualifiesForFreeShipping: subtotal >= freeShippingThreshold
    }
  }

  // Format cart items with calculated prices
  formatCartItems(items) {
    return items.map(item => ({
      ...item,
      unitPrice: item.products?.price || 0,
      totalPrice: (item.products?.price || 0) * item.quantity
    }))
  }

  // Get cart item count
  async getCartItemCount(userId = null) {
    const { data: items } = await this.getCartItems(userId)
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  // Validate cart items (check stock, prices, etc.)
  async validateCartItems(userId = null) {
    const { data: items } = await this.getCartItems(userId)
    const validationResults = []

    for (const item of items) {
      const validation = {
        itemId: item.id,
        isValid: true,
        issues: []
      }

      // Check if product still exists and is active
      if (!item.product) {
        validation.isValid = false
        validation.issues.push('Product no longer available')
      } else {
        // Check stock
        if (item.product.inventoryQuantity < item.quantity) {
          validation.isValid = false
          validation.issues.push(`Only ${item.product.inventoryQuantity} items in stock`)
        }

        // Check if price changed significantly
        const currentPrice = item.product.price
        const cartPrice = item.unitPrice
        const priceChangeThreshold = 0.1 // 10%
        
        if (Math.abs(currentPrice - cartPrice) / cartPrice > priceChangeThreshold) {
          validation.issues.push(`Price changed from $${cartPrice} to $${currentPrice}`)
        }
      }

      validationResults.push(validation)
    }

    return {
      data: validationResults,
      isValid: validationResults.every(result => result.isValid),
      error: null
    }
  }

  // Merge guest cart with user cart after login
  async mergeGuestCart(userId) {
    if (this.useMockData) {
      // For mock mode, just clear local cart
      this.clearLocalCart()
      return { data: { success: true }, error: null }
    }

    try {
      const { data: localItems } = this.getLocalCartItems()
      
      for (const item of localItems) {
        await this.addToCart(
          item.productId,
          item.quantity,
          item.variantOptions,
          userId
        )
      }

      // Clear local cart after merging
      this.clearLocalCart()
      
      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error merging guest cart:', error)
      return { data: null, error }
    }
  }
}

// Create singleton instance
export const cartService = new CartService()
export default cartService

