/**
 * Wishlist Service
 * 处理愿望清单相关的业务逻辑
 */

import { supabase } from '../lib/supabase'

class WishlistService {
  constructor() {
    this.useMockData = true // 设置为false时使用真实API
  }

  /**
   * 获取用户愿望清单
   */
  async getWishlist(userId) {
    if (this.useMockData) {
      return this.getMockWishlist(userId)
    }

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      return { data: null, error }
    }
  }

  /**
   * 模拟获取愿望清单
   */
  async getMockWishlist(/* userId */) {
    try {
      const mockWishlist = [
        {
          id: '1',
          productId: '1',
          product: {
            id: '1',
            name: 'Comfortable Armchair',
            price: 299,
            images: ['/api/placeholder/400/400'],
            rating: 4.5,
            category: 'Living Room'
          },
          addedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          productId: '2',
          product: {
            id: '2',
            name: 'Modern Coffee Table',
            price: 199,
            images: ['/api/placeholder/400/400'],
            rating: 4.8,
            category: 'Living Room'
          },
          addedAt: '2024-01-10T14:30:00Z'
        }
      ]
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { data: mockWishlist, error: null }
    } catch (error) {
      console.error('Error fetching mock wishlist:', error)
      return { data: null, error }
    }
  }

  /**
   * 添加商品到愿望清单
   */
  async addToWishlist(userId, productId) {
    if (this.useMockData) {
      return this.addToMockWishlist(userId, productId)
    }

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .insert([{
          user_id: userId,
          product_id: productId
        }])
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      return { data: null, error }
    }
  }

  /**
   * 模拟添加到愿望清单
   */
  async addToMockWishlist(userId, productId) {
    try {
      console.log('Added to wishlist:', { userId, productId })
      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error adding to mock wishlist:', error)
      return { data: null, error }
    }
  }

  /**
   * 从愿望清单移除商品
   */
  async removeFromWishlist(userId, productId) {
    if (this.useMockData) {
      return this.removeFromMockWishlist(userId, productId)
    }

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) throw error

      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      return { data: null, error }
    }
  }

  /**
   * 模拟从愿望清单移除
   */
  async removeFromMockWishlist(userId, productId) {
    try {
      console.log('Removed from wishlist:', { userId, productId })
      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error removing from mock wishlist:', error)
      return { data: null, error }
    }
  }

  /**
   * 检查商品是否在愿望清单中
   */
  async isInWishlist(userId, productId) {
    if (this.useMockData) {
      return this.isInMockWishlist(userId, productId)
    }

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return { data: !!data, error: null }
    } catch (error) {
      console.error('Error checking wishlist:', error)
      return { data: false, error }
    }
  }

  /**
   * 模拟检查是否在愿望清单中
   */
  async isInMockWishlist(/* userId, productId */) {
    try {
      // 随机返回true/false用于演示
      const inWishlist = Math.random() > 0.5
      return { data: inWishlist, error: null }
    } catch (error) {
      console.error('Error checking mock wishlist:', error)
      return { data: false, error }
    }
  }

  /**
   * 获取愿望清单商品数量
   */
  async getWishlistCount(userId) {
    if (this.useMockData) {
      return this.getMockWishlistCount(userId)
    }

    try {
      const { count, error } = await supabase
        .from('wishlist')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (error) throw error

      return { data: count || 0, error: null }
    } catch (error) {
      console.error('Error getting wishlist count:', error)
      return { data: 0, error }
    }
  }

  /**
   * 模拟获取愿望清单数量
   */
  async getMockWishlistCount(/* userId */) {
    try {
      // 返回一个随机数量用于演示
      await new Promise(resolve => setTimeout(resolve, 500))
      const count = Math.floor(Math.random() * 6)
      return { data: count, error: null }
    } catch (error) {
      console.error('Error getting mock wishlist count:', error)
      return { data: 0, error }
    }
  }

  /**
   * 清空愿望清单
   */
  async clearWishlist(userId) {
    if (this.useMockData) {
      return this.clearMockWishlist(userId)
    }

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)

      if (error) throw error

      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      return { data: null, error }
    }
  }

  /**
   * 模拟清空愿望清单
   */
  async clearMockWishlist(userId) {
    try {
      console.log('Cleared wishlist for user:', userId)
      return { data: { success: true }, error: null }
    } catch (error) {
      console.error('Error clearing mock wishlist:', error)
      return { data: null, error }
    }
  }
}

// 创建单例实例
export const wishlistService = new WishlistService()
export default wishlistService