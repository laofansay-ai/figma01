import { Link, useLocation } from 'react-router-dom'
import { Home, Grid3X3, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const Navigation = () => {
  const location = useLocation()
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/categories', icon: Grid3X3, label: 'Categories' },
    { path: '/cart', icon: ShoppingBag, label: 'Cart', badge: totalItems },
    { path: '/account', icon: User, label: 'Account' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label, badge }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${
                isActive 
                  ? 'text-yellow-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon size={24} />
                {badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default Navigation

