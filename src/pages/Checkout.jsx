import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, CreditCard, Truck, CheckCircle, AlertCircle, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import { orderService } from '../services/orderService'
import { notificationService } from '../services/notificationService'
import { Button } from '@/components/ui/button'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, summary, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  })
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [shippingMethod, setShippingMethod] = useState('standard')
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate('/cart')
    }
  }, [items, navigate, orderSuccess])
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/account')
    }
  }, [isAuthenticated, navigate])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleInputChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateShippingAddress = () => {
    const newErrors = {}
    const required = ['firstName', 'lastName', 'email', 'phone', 'addressLine1', 'city', 'state', 'postalCode']
    
    required.forEach(field => {
      if (!shippingAddress[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`
      }
    })
    
    // Email validation
    if (shippingAddress.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Phone validation
    if (shippingAddress.phone && !/^[+]?[1-9][\d]{0,2}\s?[(]?[0-9]*[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(shippingAddress.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateShippingAddress()) {
        return
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const createOrder = async () => {
    setLoading(true)
    
    try {
      const orderData = {
        userId: user?.id,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          variantOptions: item.variantOptions,
          unitPrice: item.product?.price || item.price,
          totalPrice: (item.product?.price || item.price) * item.quantity
        })),
        shippingAddress,
        paymentMethod,
        shippingMethod,
        summary
      }
      
      const { data, error } = await orderService.createOrder(orderData)
      
      if (error) {
        throw error
      }
      
      console.log('Order created successfully:', data)
      
      // 发送订单确认通知
      notificationService.sendOrderConfirmation(data)
      
      // Show success message briefly
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
      
      // Clear cart after successful order
      await clearCart()
      
      setOrderSuccess(true)
      setCurrentStep(4) // Success step
      
    } catch (error) {
      console.error('Error creating order:', error)
      notificationService.showError('Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success page
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-gray-900">Order Confirmation</h1>
          </div>
        </header>
        
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 text-center mb-8 max-w-md">
            Thank you for your order. You will receive an email confirmation shortly with your order details and tracking information.
          </p>
          <div className="space-y-3 w-full max-w-sm">
            <Link to="/account">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-2xl">
                View My Orders
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-2xl">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <CheckCircle size={20} />
            <span>Order placed successfully!</span>
            <button onClick={() => setShowSuccessMessage(false)}>
              <X size={16} className="hover:text-green-200" />
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => currentStep === 1 ? navigate('/cart') : handlePrevStep()}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Progress Steps */}
      <div className="px-4 py-6 border-b border-gray-100">
        <div className="flex items-center justify-center space-x-4">
          {[
            { step: 1, label: 'Shipping', icon: MapPin },
            { step: 2, label: 'Payment', icon: CreditCard },
            { step: 3, label: 'Review', icon: CheckCircle }
          ].map(({ step, label, icon }) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2
                ${currentStep >= step ? 'bg-yellow-500 border-yellow-500 text-white' : 'border-gray-300 text-gray-400'}
              `}>
                {currentStep > step ? <CheckCircle size={20} /> : React.createElement(icon, { size: 20 })}
              </div>
              <span className={`ml-2 text-sm font-medium ${currentStep >= step ? 'text-gray-900' : 'text-gray-400'}`}>
                {label}
              </span>
              {step < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-4" />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Step 1: Shipping Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={shippingAddress.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={shippingAddress.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                <input
                  type="text"
                  value={shippingAddress.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="123 Main Street"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                <input
                  type="text"
                  value={shippingAddress.addressLine2}
                  onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Apartment, suite, etc."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="NY"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Payment & Shipping</h2>
            
            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
              <div className="space-y-3">
                {[
                  { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                  { id: 'paypal', label: 'PayPal', icon: CreditCard },
                  { id: 'apple_pay', label: 'Apple Pay', icon: CreditCard }
                ].map((method) => (
                  <label key={method.id} className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <method.icon size={20} className="text-gray-600 mr-3" />
                    <span className="text-gray-900">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Shipping Methods */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Shipping Method</h3>
              <div className="space-y-3">
                {[
                  { id: 'standard', label: 'Standard Shipping', time: '5-7 business days', price: 0 },
                  { id: 'express', label: 'Express Shipping', time: '2-3 business days', price: 15 },
                  { id: 'overnight', label: 'Overnight Shipping', time: '1 business day', price: 25 }
                ].map((method) => (
                  <label key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={shippingMethod === method.id}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <Truck size={20} className="text-gray-600 mr-3" />
                      <div>
                        <span className="text-gray-900 font-medium">{method.label}</span>
                        <p className="text-sm text-gray-500">{method.time}</p>
                      </div>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {method.price === 0 ? 'Free' : formatPrice(method.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Order Review */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Order Review</h2>
            
            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Items ({summary.itemCount})</h3>
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.product?.images?.[0] || item.image || '/api/placeholder/64/64'}
                      alt={item.product?.name || item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product?.name || item.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatPrice((item.product?.price || item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(summary.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {summary.shipping === 0 ? 'Free' : formatPrice(summary.shipping)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-yellow-500">{formatPrice(summary.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-gray-100">
        {currentStep < 3 ? (
          <Button 
            onClick={handleNextStep}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-2xl font-semibold text-lg"
          >
            Continue
          </Button>
        ) : (
          <Button 
            onClick={createOrder}
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : `Place Order - ${formatPrice(summary.total)}`}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Checkout