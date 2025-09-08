import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Filter, Grid, List, Heart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Button } from '@/components/ui/button'

const ProductList = () => {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const { addItem } = useCart()
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popular')

  const products = [
    {
      id: 1,
      name: 'Modern Wooden Chair',
      price: 299,
      originalPrice: 399,
      image: '/api/placeholder/300/300',
      category: 'furniture',
      rating: 4.8,
      reviews: 124,
      isNew: true,
      isSale: true,
      description: 'Comfortable modern chair with ergonomic design'
    },
    {
      id: 2,
      name: 'Ceramic Vase Set',
      price: 89,
      image: '/api/placeholder/300/300',
      category: 'decor',
      rating: 4.6,
      reviews: 89,
      isNew: false,
      isSale: false,
      description: 'Beautiful ceramic vase set for home decoration'
    },
    {
      id: 3,
      name: 'Dining Table Oak',
      price: 599,
      originalPrice: 799,
      image: '/api/placeholder/300/300',
      category: 'furniture',
      rating: 4.9,
      reviews: 203,
      isNew: false,
      isSale: true,
      description: 'Solid oak dining table for 6 people'
    },
    {
      id: 4,
      name: 'Table Lamp Gold',
      price: 149,
      image: '/api/placeholder/300/300',
      category: 'lighting',
      rating: 4.7,
      reviews: 67,
      isNew: true,
      isSale: false,
      description: 'Elegant gold table lamp with warm light'
    },
    {
      id: 5,
      name: 'Bookshelf Modern',
      price: 249,
      image: '/api/placeholder/300/300',
      category: 'furniture',
      rating: 4.5,
      reviews: 156,
      isNew: false,
      isSale: false,
      description: 'Modern bookshelf with 5 shelves'
    },
    {
      id: 6,
      name: 'Floor Cushion Set',
      price: 79,
      originalPrice: 99,
      image: '/api/placeholder/300/300',
      category: 'textiles',
      rating: 4.4,
      reviews: 92,
      isNew: false,
      isSale: true,
      description: 'Comfortable floor cushions set of 4'
    }
  ]

  const filteredProducts = category 
    ? products.filter(product => product.category === category)
    : products

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.isNew - a.isNew
      default:
        return b.rating - a.rating
    }
  })

  const handleAddToCart = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
          </h1>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Filter size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <List size={20} />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </header>

      {/* Products */}
      <div className="px-4 py-6">
        <p className="text-gray-600 text-sm mb-6">
          {sortedProducts.length} products found
        </p>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
            {sortedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      New
                    </span>
                  )}
                  {product.isSale && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Sale
                    </span>
                  )}
                  <button 
                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Heart size={16} className="text-gray-400" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-yellow-500">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="flex bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-yellow-500">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white ml-4"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList

