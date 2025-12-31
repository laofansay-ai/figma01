import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, HomeIcon, Package, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import { orderService } from '../services/orderService'
import { notificationService } from '../services/notificationService'

const Checkout = () => {
  const { user } = useAuth()
  const { items, summary, clearCart, refreshCart } = useCart()
  const navigate = useNavigate()

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.user_metadata?.full_name || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: user?.user_metadata?.phone || '',
    email: user?.email || ''
  })
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      // Optionally redirect to login or show a message for guest checkout
      // For now, allow guest checkout but prompt for info
    }
    if (items.length === 0 && !orderPlaced) {
      navigate('/cart') // Redirect to cart if no items and no order placed yet
    }
  }, [user, items, orderPlaced, navigate])

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    setError(null)
    try {
      if (!user && (!shippingAddress.fullName || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.zipCode || !shippingAddress.phone || !shippingAddress.email)) {
        throw new Error('Please fill in all required shipping and contact information.')
      }

      const orderData = {
        userId: user?.id || null,
        shippingAddress,
        paymentMethod,
        shippingMethod: 'standard', // 默认配送方式
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product?.price || 0,
          totalPrice: (item.product?.price || 0) * item.quantity,
          variantOptions: item.variantOptions,
          product: item.product // 传递产品数据用于order_items表
        })),
        summary: summary
      }

      console.log('Creating order for user:', user?.id, 'Order data:', orderData)

      const { data, error: orderError } = await orderService.createOrder(orderData)

      if (orderError) {
        throw new Error(orderError.message || 'Failed to place order.')
      }

      // 发送订单确认通知
      notificationService.sendOrderConfirmation(data)

      setOrderPlaced(data)
      clearCart() // Clear cart after successful order
      refreshCart() // Refresh cart context
    } catch (err) {
      setError(err.message)
      notificationService.showError('Failed to create order. Please try again.')
      console.error('Checkout error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <CheckCircle size={64} className="text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">Your order #{orderPlaced.order_number || orderPlaced.id} has been confirmed.</p>
        <Link to="/account" className="bg-yellow-500 text-white px-6 py-3 rounded-xl hover:bg-yellow-600 transition-colors">
          View My Orders
        </Link>
        <Link to="/" className="mt-4 text-yellow-500 hover:underline">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="px-4 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          <div className="w-8"></div> {/* Placeholder for alignment */}
        </div>
      </header>

      <main className="p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Shipping Address */}
        <section className="mb-6 p-4 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><HomeIcon size={20} className="mr-2" />Shipping Address</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleAddressChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={shippingAddress.email}
                onChange={handleAddressChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleAddressChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="address1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
              <input
                type="text"
                id="address1"
                name="address1"
                value={shippingAddress.address1}
                onChange={handleAddressChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="address2" className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
              <input
                type="text"
                id="address2"
                name="address2"
                value={shippingAddress.address2}
                onChange={handleAddressChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <select
                  id="country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                >
                  <option value="USA">United States</option>
                  <option value="CAN">Canada</option>
                  <option value="GBR">United Kingdom</option>
                  <option value="AUS">Australia</option>
                  <option value="DEU">Germany</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="mb-6 p-4 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><CreditCard size={20} className="mr-2" />Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">Credit Card</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">PayPal</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">Cash on Delivery</span>
            </label>
          </div>
        </section>

        {/* Order Summary */}
        <section className="mb-6 p-4 bg-gray-50 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Package size={20} className="mr-2" />Order Summary</h2>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span>{item.name} x {item.quantity}</span>
                <span>{item.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-sm text-gray-700 font-medium">
                <span>Subtotal</span>
                <span>{summary.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 font-medium">
                <span>Shipping</span>
                <span>{summary.shipping.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 font-medium">
                <span>Tax</span>
                <span>{summary.tax.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
                <span>Total</span>
                <span>{summary.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing || items.length === 0}
          className="w-full bg-yellow-500 text-white py-4 rounded-xl text-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>
      </main>
    </div>
  )
}

export default Checkout

