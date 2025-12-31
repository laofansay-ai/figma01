import { createContext, useContext, useState, useEffect } from 'react'
import { cartService } from '../services/cartService'
import { useAuth } from '../hooks/useAuth'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0
  })

  // Load cart items when component mounts or user changes
  useEffect(() => {
    loadCartItems()
  }, [user])

  // Calculate summary when items change
  useEffect(() => {
    const newSummary = cartService.calculateCartSummary(items)
    setSummary(newSummary)
  }, [items])

  const loadCartItems = async () => {
    setLoading(true)
    try {
      console.log('Loading cart items for user:', user?.id)
      const { data, error } = await cartService.getCartItems(user?.id)
      console.log('Cart items loaded:', data, 'Error:', error)
      
      if (error) {
        console.error('Error loading cart items:', error)
      } else {
        setItems(data || [])
        console.log('Cart items set to state:', data)
      }
    } catch (error) {
      console.error('Error loading cart items:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1, variantOptions = {}) => {
    try {
      const { error } = await cartService.addToCart(
        productId,  // 传递 productId 而不是 product.id
        quantity,
        variantOptions,
        user?.id
      )
      
      if (!error) {
        await loadCartItems()
        return { success: true }
      } else {
        console.error('Error adding to cart:', error)
        return { success: false, error }
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error }
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { error } = await cartService.updateCartItem(itemId, quantity, user?.id)
      
      if (!error) {
        await loadCartItems()
        return { success: true }
      } else {
        console.error('Error updating cart item:', error)
        return { success: false, error }
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      return { success: false, error }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const { error } = await cartService.removeFromCart(itemId, user?.id)
      
      if (!error) {
        await loadCartItems()
        return { success: true }
      } else {
        console.error('Error removing from cart:', error)
        return { success: false, error }
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { success: false, error }
    }
  }

  const clearCart = async () => {
    try {
      const { error } = await cartService.clearCart(user?.id)
      
      if (!error) {
        setItems([])
        return { success: true }
      } else {
        console.error('Error clearing cart:', error)
        return { success: false, error }
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { success: false, error }
    }
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const isInCart = (productId, variantOptions = {}) => {
    return items.some(item => 
      item.productId === productId && 
      JSON.stringify(item.variantOptions) === JSON.stringify(variantOptions)
    )
  }

  const getCartItem = (productId, variantOptions = {}) => {
    return items.find(item => 
      item.productId === productId && 
      JSON.stringify(item.variantOptions) === JSON.stringify(variantOptions)
    )
  }

  // Legacy methods for backward compatibility
  const getTotal = () => summary.total

  const value = {
    items,
    loading,
    summary,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemCount,
    getTotal, // Legacy method
    isInCart,
    getCartItem,
    refreshCart: loadCartItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

