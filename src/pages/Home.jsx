import { Link } from 'react-router-dom'
import { Search, Bell, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Modern Wooden Chair',
      price: 299,
      image: '/api/placeholder/300/300',
      category: 'Furniture'
    },
    {
      id: 2,
      name: 'Ceramic Vase',
      price: 89,
      image: '/api/placeholder/300/300',
      category: 'Decor'
    },
    {
      id: 3,
      name: 'Dining Table',
      price: 599,
      image: '/api/placeholder/300/300',
      category: 'Furniture'
    },
    {
      id: 4,
      name: 'Table Lamp',
      price: 149,
      image: '/api/placeholder/300/300',
      category: 'Lighting'
    }
  ]

  const categories = [
    { name: 'Furniture', icon: '🪑', count: 120 },
    { name: 'Decor', icon: '🏺', count: 85 },
    { name: 'Lighting', icon: '💡', count: 45 },
    { name: 'Textiles', icon: '🛏️', count: 67 }
  ]

  return (
    <div className="pb-20 bg-gradient-to-b from-yellow-50 to-white min-h-screen">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ULMO</h1>
            <p className="text-gray-600 text-sm">Modern Living</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full bg-white shadow-sm">
              <Bell size={20} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full bg-white shadow-sm">
              <Heart size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 mb-8">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">New Collection</h2>
          <p className="text-yellow-100 mb-4">Discover our latest furniture designs</p>
          <Button className="bg-white text-yellow-500 hover:bg-gray-100">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Categories</h3>
          <Link to="/categories" className="text-yellow-500 font-medium">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/products?category=${category.name.toLowerCase()}`}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h4 className="font-semibold text-gray-900">{category.name}</h4>
              <p className="text-gray-500 text-sm">{category.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Featured</h3>
          <Link to="/products" className="text-yellow-500 font-medium">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm">
                  <Heart size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-lg font-bold text-yellow-500">
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offer */}
      <section className="px-4 mb-8">
        <div className="bg-gray-900 rounded-3xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Special Offer</h3>
          <p className="text-gray-300 mb-4">Get 20% off on your first order</p>
          <Button className="bg-yellow-500 text-white hover:bg-yellow-600">
            Claim Offer
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Home

