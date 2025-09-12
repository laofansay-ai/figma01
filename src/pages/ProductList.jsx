import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Filter, Grid, List, Star, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { productService } from '../services/productService'

const ProductList = () => {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart } = useCart()
  
  const [products, setProducts] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get('page')) || 1
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        let result
        
        if (category) {
          // Load products by category
          result = await productService.getProductsByCategory(category, {
            page: currentPage,
            limit: 20,
            sortBy: sortBy === 'featured' ? 'is_featured' : sortBy
          })
          
          // Load category info
          const { data: catInfo } = await productService.getCategoryBySlug(category)
          setCategoryInfo(catInfo)
        } else if (searchQuery) {
          // Search products
          result = await productService.searchProducts(searchQuery, {
            page: currentPage,
            limit: 20,
            sortBy: sortBy === 'featured' ? 'is_featured' : sortBy
          })
        } else {
          // Load all products
          result = await productService.getProducts({
            page: currentPage,
            limit: 20,
            sortBy: sortBy === 'featured' ? 'is_featured' : sortBy
          })
        }

        if (result.data) {
          setProducts(result.data.products || result.data || [])
          setPagination(result.data.pagination)
        }
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category, currentPage, sortBy, searchQuery])

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/api/placeholder/300/300',
      quantity: 1
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const calculateDiscount = (price, comparePrice) => {
    if (!comparePrice || comparePrice <= price) return 0
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    setSearchParams(params)
  }

  const getPageTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`
    if (categoryInfo) return categoryInfo.name
    return 'All Products'
  }

  if (loading) {
    return (
      <div className="pb-20 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="px-4 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
              {categoryInfo && (
                <p className="text-sm text-gray-500">{categoryInfo.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Sort and Filter Bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {pagination ? `${pagination.total} products` : `${products.length} products`}
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="featured">Featured</option>
            <option value="price">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <main className="px-4 py-6">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No products found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-32 h-32' : ''}`}>
                  <img
                    src={product.images?.[0] || '/api/placeholder/300/300'}
                    alt={product.name}
                    className={`object-cover ${
                      viewMode === 'list' ? 'w-full h-full' : 'w-full h-40'
                    }`}
                  />
                  {product.comparePrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      -{calculateDiscount(product.price, product.comparePrice)}%
                    </div>
                  )}
                  <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full">
                    <Heart size={16} className="text-gray-600" />
                  </button>
                </div>
                
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <Link to={`/products/${product.slug || product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  
                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                      </div>
                      {product.reviewCount && (
                        <span className="text-sm text-gray-400 ml-1">({product.reviewCount})</span>
                      )}
                    </div>
                  )}

                  <div className={`flex items-center ${viewMode === 'list' ? 'justify-between' : 'justify-between'}`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inventoryQuantity || product.inventoryQuantity === 0}
                      className="p-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                  
                  {/* Stock status */}
                  {product.inventoryQuantity === 0 && (
                    <p className="text-sm text-red-500 mt-2">Out of stock</p>
                  )}
                  {product.inventoryQuantity > 0 && product.inventoryQuantity <= 5 && (
                    <p className="text-sm text-orange-500 mt-2">Only {product.inventoryQuantity} left</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg ${
                    pagination.page === pageNum
                      ? 'bg-yellow-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProductList

