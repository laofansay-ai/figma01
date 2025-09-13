import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { orderService } from '../services/orderService'
import { wishlistService } from '../services/wishlistService'



export const useUserStats = () => {
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    ordersCount: 0,
    wishlistCount: 0,
    totalSpent: 0,
    loading: true
  })

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setStats({
        ordersCount: 0,
        wishlistCount: 0,
        totalSpent: 0,
        loading: false
      })
      return
    }

    loadUserStats()
  }, [isAuthenticated, user])

  const loadUserStats = async () => {
    setStats(prev => ({ ...prev, loading: true }))
    
    try {
      // Load orders and calculate stats
      const { data: orders, error: ordersError } = await orderService.getUserOrders(user.id)
      
      let ordersCount = 0
      let totalSpent = 0
      
      if (!ordersError && orders) {
        ordersCount = orders.length
        totalSpent = orders.reduce((sum, order) => {
          return sum + (order.total_amount || order.summary?.total || 0)
        }, 0)
      }

      // Load wishlist count
      const { data: wishlistCount, error: wishlistError } = await wishlistService.getWishlistCount(user.id)
      
      setStats({
        ordersCount,
        wishlistCount: wishlistError ? 0 : (wishlistCount || 0),
        totalSpent,
        loading: false
      })
      
    } catch (error) {
      console.error('Error loading user stats:', error)
      setStats({
        ordersCount: 0,
        wishlistCount: 0,
        totalSpent: 0,
        loading: false
      })
    }
  }

  const refreshStats = () => {
    if (isAuthenticated && user) {
      loadUserStats()
    }
  }

  return {
    ...stats,
    refreshStats
  }
}