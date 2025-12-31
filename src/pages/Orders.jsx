import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { orderService } from '../services/orderService'
import { Button } from '@/components/ui/button'

const Orders = () => {
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'delivered', 'cancelled'

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    
    loadOrders()
  }, [isAuthenticated, user])

  const loadOrders = async () => {
    setLoading(true)
    try {
      console.log('Loading orders for user:', user?.id)
      const { data, error } = await orderService.getUserOrders(user?.id)
      console.log('Orders loaded:', data, 'Error:', error)
      if (error) {
        console.error('Error loading orders:', error)
      } else {
        setOrders(data || [])
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />
      case 'processing':
        return <Package size={16} className="text-blue-500" />
      case 'shipped':
        return <Truck size={16} className="text-purple-500" />
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />
      default:
        return <Clock size={16} className="text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
          <div className="flex items-center justify-between">
            <Link to="/account" className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={24} className="text-gray-700" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
            <div className="w-10" />
          </div>
        </header>
        
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Package size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view orders</h2>
          <p className="text-gray-600 text-center mb-8">
            Please sign in to your account to view your order history
          </p>
          <Link to="/account">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-2xl">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <Link to="/account" className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'processing', label: 'Processing' },
            { key: 'shipped', label: 'Shipped' },
            { key: 'delivered', label: 'Delivered' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {filter === 'all' 
                ? 'Start shopping to see your orders here'
                : `You don't have any ${filter} orders at the moment`
              }
            </p>
            <Link to="/">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-2xl">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.order_number || order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium text-gray-900">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.order_items?.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.product_image || item.products?.images?.[0] || '/api/placeholder/48/48'}
                          alt={item.product_name || item.products?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product_name || item.products?.name || 'Product'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} • {formatPrice(item.unit_price || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.order_items?.length > 2 && (
                    <p className="text-xs text-gray-500 pl-15">
                      +{order.order_items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Total: {formatPrice(order.total_amount || order.summary?.total || 0)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-3 py-1 border-gray-300 text-gray-700"
                    >
                      View Details
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-3 py-1 border-red-300 text-red-600"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders