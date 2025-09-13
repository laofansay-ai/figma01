import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, ShoppingBag, Star, Trash2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../context/CartContext'
import { wishlistService } from '../services/wishlistService'
import { Button } from '@/components/ui/button'



const Wishlist = () => {
  const { user, isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [removingItems, setRemovingItems] = useState(new Set())

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    
    loadWishlist()
  }, [isAuthenticated, user])

  const loadWishlist = async () => {
    setLoading(true)
    try {
      const { data, error } = await wishlistService.getWishlist(user?.id)
      if (error) {
        console.error('Error loading wishlist:', error)
      } else {
        setWishlist(data || [])
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (item) => {
    setRemovingItems(prev => new Set(prev).add(item.id))
    
    try {
      const { error } = await wishlistService.removeFromWishlist(user?.id, item.productId)
      if (error) {
        console.error('Error removing from wishlist:', error)
      } else {
        // Remove from local state
        setWishlist(prev => prev.filter(w => w.id !== item.id))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }
  }

  const handleAddToCart = async (product) => {
    try {
      const { success } = await addToCart(product.id, 1)
      if (success) {
        // Show success feedback
        console.log('Added to cart:', product.name)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
          <div className="flex items-center justify-between">
            <Link to="/account" className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={24} className="text-gray-700" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Wishlist</h1>
            <div className="w-10" />
          </div>
        </header>
        
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Heart size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view wishlist</h2>
          <p className="text-gray-600 text-center mb-8">
            Please sign in to your account to view your saved items
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
          <h1 className="text-xl font-bold text-gray-900">
            Wishlist ({wishlist.length})
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wishlist...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 text-center mb-8">
              Save items you love to your wishlist for easy access later
            </p>
            <Link to="/">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-2xl">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className={`bg-white border border-gray-200 rounded-2xl p-4 shadow-sm transition-all duration-300 ${
                  removingItems.has(item.id) ? 'opacity-50 scale-95' : 'opacity-100'
                }`}
              >
                <div className="flex space-x-4">
                  {/* Product Image */}
                  <Link to={`/products/${item.product.id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={item.product.images?.[0] || '/api/placeholder/96/96'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="block mb-2"
                    >
                      <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-yellow-600 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      {item.product.category}
                    </p>

                    {item.product.rating && (
                      <div className="flex items-center space-x-1 mb-2">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {item.product.rating}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-yellow-500">
                        {formatPrice(item.product.price)}
                      </span>
                      <p className="text-xs text-gray-500">
                        Added {formatDate(item.addedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => handleAddToCart(item.product)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl text-sm font-medium"
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    onClick={() => handleRemoveFromWishlist(item)}
                    variant="outline"
                    className="px-4 py-2 border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
                    disabled={removingItems.has(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      {wishlist.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 py-4 bg-white border-t border-gray-100">
          <div className="flex space-x-3">
            <Button
              onClick={() => {
                // Add all to cart
                wishlist.forEach(item => handleAddToCart(item.product))
              }}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-2xl font-semibold"
            >
              Add All to Cart
            </Button>
            <Button
              variant="outline"
              className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wishlist