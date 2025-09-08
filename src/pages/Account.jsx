import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  MapPin, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Edit
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import { Button } from '@/components/ui/button'

const Account = () => {
  const { user, isAuthenticated, login, logout } = useUser()
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })

  const handleLogin = (e) => {
    e.preventDefault()
    // Mock login - in real app this would call an API
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: loginData.email,
      phone: '+1 234 567 8900',
      avatar: '/api/placeholder/100/100',
      joinDate: '2024-01-15'
    }
    login(mockUser)
    setShowLoginForm(false)
  }

  const menuItems = [
    {
      icon: ShoppingBag,
      title: 'My Orders',
      subtitle: 'Track your orders',
      path: '/orders',
      badge: '3'
    },
    {
      icon: Heart,
      title: 'Wishlist',
      subtitle: 'Your favorite items',
      path: '/wishlist',
      badge: '12'
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Manage your cards',
      path: '/payment-methods'
    },
    {
      icon: MapPin,
      title: 'Addresses',
      subtitle: 'Delivery addresses',
      path: '/addresses'
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage notifications',
      path: '/notifications'
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences',
      path: '/settings'
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help',
      path: '/help'
    }
  ]

  if (!isAuthenticated) {
    return (
      <div className="pb-20 bg-white min-h-screen">
        {/* Header */}
        <header className="px-4 pt-12 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Account</h1>
        </header>

        {showLoginForm ? (
          /* Login Form */
          <div className="px-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Welcome Back</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold"
                >
                  Sign In
                </Button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowLoginForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Back to options
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Login Options */
          <div className="px-4">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
              <p className="text-gray-600">Access your orders, wishlist, and more</p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-2xl font-semibold text-lg"
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50"
              >
                Create Account
              </Button>
            </div>

            <div className="mt-8 text-center">
              <Link to="/" className="text-yellow-500 font-medium">
                Continue as Guest
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Account</h1>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Edit size={20} className="text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">Member since {new Date(user.joinDate).getFullYear()}</p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">12</div>
            <div className="text-sm text-gray-600">Orders</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">8</div>
            <div className="text-sm text-gray-600">Wishlist</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">$2,450</div>
            <div className="text-sm text-gray-600">Spent</div>
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="px-4 mb-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <item.icon size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Logout */}
      <section className="px-4">
        <button
          onClick={logout}
          className="w-full bg-white rounded-2xl p-4 flex items-center justify-center space-x-3 text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-semibold">Sign Out</span>
        </button>
      </section>

      {/* App Info */}
      <section className="px-4 mt-8 text-center">
        <p className="text-gray-500 text-sm">Ulmo E-Commerce v1.0.0</p>
      </section>
    </div>
  )
}

export default Account

