import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'

const Cart = () => {
  const { items, updateQuantity, removeFromCart, summary, clearCart } = useCart()
  const { isAuthenticated } = useAuth()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const finalTotal = summary.total

  if (items.length === 0) {
    return (
      <div className="pb-20 bg-white min-h-screen">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={24} className="text-gray-700" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
            <div className="w-10" />
          </div>
        </header>

        {/* Empty Cart */}
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 text-center mb-8">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link to="/products">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-2xl">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-500 font-medium text-sm"
          >
            Clear All
          </button>
        </div>
      </header>

      {/* Cart Items */}
      <div className="px-4 py-6">
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={`${item.id}-${item.variantOptions?.color}-${item.variantOptions?.size}`} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.product?.images?.[0] || item.image || '/api/placeholder/80/80'}
                    alt={item.product?.name || item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {item.product?.name || item.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {item.variantOptions?.color && (
                      <span className="text-xs text-gray-500">
                        Color: {item.variantOptions.color}
                      </span>
                    )}
                    {item.variantOptions?.size && (
                      <span className="text-xs text-gray-500">
                        Size: {item.variantOptions.size}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-yellow-500">
                      ${item.product?.price || item.price}
                    </span>
                    <div className="flex items-center space-x-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 rounded-l-lg"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-2 font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 rounded-r-lg"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code */}
        <div className="mb-6">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl">
              Apply
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal ({summary.itemCount} items)</span>
              <span className="font-medium">${summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${summary.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-yellow-500">
                  ${summary.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">You might also like</h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <Link
                key={item}
                to={`/product/${item + 10}`}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100">
                  <img
                    src="/api/placeholder/200/200"
                    alt="Recommended product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Recommended Item {item}
                  </h4>
                  <span className="text-yellow-500 font-bold">$99</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 py-4 bg-white border-t border-gray-100">
        {isAuthenticated ? (
          <Link to="/checkout">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-2xl font-semibold text-lg">
              Proceed to Checkout - ${finalTotal.toFixed(2)}
            </Button>
          </Link>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-600">
              Please sign in to proceed with checkout
            </p>
            <Link to="/account">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-2xl font-semibold text-lg">
                Sign In to Checkout - ${finalTotal.toFixed(2)}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart

