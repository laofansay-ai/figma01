import { supabase } from '../lib/supabase'
import {
	mockProducts,
	mockCategories,
	getProductById,
	getProductsByCategory,
	getFeaturedProducts,
	searchProducts,
	getCategoryBySlug
} from '../data/mockProducts'

class ProductService {
	constructor() {
	this.useMockData = false // 使用真实的 Supabase 数据库
	}

	// Categories
	async getCategories() {
		if (this.useMockData) {
			return { data: mockCategories, error: null }
		}

		try {
			const { data, error } = await supabase
				.from('categories')
				.select('*')
				.eq('is_active', true)
				.order('sort_order')

			return { data, error }
		} catch (error) {
			console.error('Error fetching categories:', error)
			return { data: null, error }
		}
	}

	async getCategoryBySlug(slug) {
		if (this.useMockData) {
			return { data: getCategoryBySlug(slug), error: null }
		}

			try {
			const { data, error } = await supabase
				.from('categories')
				.select('*')
				.eq('slug', slug)
				.eq('is_active', true)
				.maybeSingle()  // 使用 maybeSingle() 避免 PGRST116 错误

			return { data, error }
		} catch (error) {
			console.error('Error fetching category:', error)
			return { data: null, error }
		}
	}

	// Products
	async getProducts(options = {}) {
		const {
			page = 1,
			limit = 20,
			category = null,
			search = null,
			sortBy = 'created_at',
			sortOrder = 'desc',
			minPrice = null,
			maxPrice = null,
			isFeatured = null
		} = options

		if (this.useMockData) {
			let products = [...mockProducts]

			// Apply filters
			if (category) {
				products = products.filter((p) => p.category === category)
			}

			if (search) {
				const searchTerm = search.toLowerCase()
				products = products.filter(
					(p) =>
						p.name.toLowerCase().includes(searchTerm) ||
						p.description.toLowerCase().includes(searchTerm) ||
						p.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
				)
			}

			if (minPrice !== null) {
				products = products.filter((p) => p.price >= minPrice)
			}

			if (maxPrice !== null) {
				products = products.filter((p) => p.price <= maxPrice)
			}

			if (isFeatured !== null) {
				products = products.filter((p) => p.isFeatured === isFeatured)
			}

			// Apply sorting
			products.sort((a, b) => {
				let aValue, bValue

				switch (sortBy) {
					case 'price':
						aValue = a.price
						bValue = b.price
						break
					case 'name':
						aValue = a.name.toLowerCase()
						bValue = b.name.toLowerCase()
						break
					case 'rating':
						aValue = a.rating || 0
						bValue = b.rating || 0
						break
					default:
						aValue = a.id
						bValue = b.id
				}

				if (sortOrder === 'desc') {
					return bValue > aValue ? 1 : -1
				} else {
					return aValue > bValue ? 1 : -1
				}
			})

			// Apply pagination
			const startIndex = (page - 1) * limit
			const endIndex = startIndex + limit
			const paginatedProducts = products.slice(startIndex, endIndex)

			return {
				data: {
					products: paginatedProducts,
					pagination: {
						page,
						limit,
						total: products.length,
						totalPages: Math.ceil(products.length / limit)
					}
				},
				error: null
			}
		}

		try {
			let query = supabase
				.from('products')
				.select(
					`
          *,
          categories (
            id,
            name,
            slug
          )
        `
				)
				.eq('is_active', true)

			// Apply filters
			if (category) {
				query = query.eq('categories.slug', category)
			}

			if (search) {
				query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
			}

			if (minPrice !== null) {
				query = query.gte('price', minPrice)
			}

			if (maxPrice !== null) {
				query = query.lte('price', maxPrice)
			}

			if (isFeatured !== null) {
				query = query.eq('is_featured', isFeatured)
			}

			// Apply sorting
			const orderColumn = sortBy === 'created_at' ? 'created_at' : sortBy
			query = query.order(orderColumn, { ascending: sortOrder === 'asc' })

			// Apply pagination
			const startIndex = (page - 1) * limit
			query = query.range(startIndex, startIndex + limit - 1)

			const { data, error, count } = await query

			if (error) throw error

			return {
				data: {
					products: data,
					pagination: {
						page,
						limit,
						total: count,
						totalPages: Math.ceil(count / limit)
					}
				},
				error: null
			}
		} catch (error) {
			console.error('Error fetching products:', error)
			return { data: null, error }
		}
	}

	async getProductById(id) {
		if (this.useMockData) {
			return { data: getProductById(id), error: null }
		}

		try {
			const { data, error } = await supabase
				.from('products')
				.select(
					`
          *,
          categories (
            id,
            name,
            slug
          )
        `
				)
				.eq('id', id)
				.eq('is_active', true)
				.maybeSingle()  // 使用 maybeSingle() 避免 PGRST116 错误

			return { data, error }
		} catch (error) {
			console.error('Error fetching product:', error)
			return { data: null, error }
		}
	}

	async getProductBySlug(slug) {
		if (this.useMockData) {
			const product = mockProducts.find((p) => p.slug === slug)
			return { data: product, error: product ? null : 'Product not found' }
		}

		try {
			const { data, error } = await supabase
				.from('products')
				.select(
					`
          *,
          categories (
            id,
            name,
            slug
          )
        `
				)
				.eq('slug', slug)
				.eq('is_active', true)
				.maybeSingle()  // 使用 maybeSingle() 避免 PGRST116 错误

			return { data, error }
		} catch (error) {
			console.error('Error fetching product:', error)
			return { data: null, error }
		}
	}

	async getFeaturedProducts(limit = 8) {
		if (this.useMockData) {
			const featured = getFeaturedProducts().slice(0, limit)
			return { data: featured, error: null }
		}

			try {
				const { data, error } = await supabase
					.from('products')
					.select(
						`
          *,
          categories (
            id,
            name,
            slug
          )
        `
					)
					.eq('is_active', true)
					.eq('is_featured', true)
					.order('created_at', { ascending: false })
					.limit(limit)

			return { data, error }
		} catch (error) {
			console.error('Error fetching featured products:', error)
			return { data: null, error }
		}
	}

	async getProductsByCategory(categorySlug, options = {}) {
		const { limit = 20, page = 1 } = options

		if (this.useMockData) {
			const products = getProductsByCategory(categorySlug)
			const startIndex = (page - 1) * limit
			const endIndex = startIndex + limit
			const paginatedProducts = products.slice(startIndex, endIndex)

			return {
				data: {
					products: paginatedProducts,
					pagination: {
						page,
						limit,
						total: products.length,
						totalPages: Math.ceil(products.length / limit)
					}
				},
				error: null
			}
		}

		return this.getProducts({ ...options, category: categorySlug })
	}

	async searchProducts(query, options = {}) {
		if (this.useMockData) {
			const products = searchProducts(query)
			return { data: products, error: null }
		}

		return this.getProducts({ ...options, search: query })
	}

	// Product Reviews
	async getProductReviews(productId, options = {}) {
		const { page = 1, limit = 10, sortBy = 'created_at' } = options

		if (this.useMockData) {
			// Mock reviews data
			const mockReviews = [
				{
					id: 1,
					productId,
					userName: 'John D.',
					rating: 5,
					title: 'Great product!',
					content: 'Very satisfied with this purchase. Quality is excellent.',
					isVerifiedPurchase: true,
					helpfulCount: 12,
					createdAt: '2024-01-15T10:30:00Z'
				},
				{
					id: 2,
					productId,
					userName: 'Sarah M.',
					rating: 4,
					title: 'Good value',
					content: 'Nice design and good quality for the price.',
					isVerifiedPurchase: true,
					helpfulCount: 8,
					createdAt: '2024-01-10T14:20:00Z'
				}
			]

			return {
				data: {
					reviews: mockReviews,
					summary: {
						averageRating: 4.5,
						totalReviews: mockReviews.length,
						ratingDistribution: {
							5: 1,
							4: 1,
							3: 0,
							2: 0,
							1: 0
						}
					}
				},
				error: null
			}
		}

		try {
			const { data, error } = await supabase
				.from('product_reviews')
				.select('*')
				.eq('product_id', productId)
				.eq('is_approved', true)
				.order(sortBy, { ascending: false })
				.range((page - 1) * limit, page * limit - 1)

			return { data, error }
		} catch (error) {
			console.error('Error fetching product reviews:', error)
			return { data: null, error }
		}
	}

	// Utility methods
	formatPrice(price, currency = 'USD') {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency
		}).format(price)
	}

	calculateDiscount(price, comparePrice) {
		if (!comparePrice || comparePrice <= price) return 0
		return Math.round(((comparePrice - price) / comparePrice) * 100)
	}

	// Search suggestions
	async searchSuggestions(query, limit = 5) {
		if (this.useMockData) {
			const suggestions = mockProducts
				.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
				.map((p) => p.name)
				.slice(0, limit)

			return { data: suggestions, error: null }
		}

		try {
			const { data, error } = await supabase
				.from('products')
				.select('name')
				.ilike('name', `%${query}%`)
				.eq('is_active', true)
				.limit(limit)

			const suggestions = data ? data.map((item) => item.name) : []
			return { data: suggestions, error }
		} catch (error) {
			console.error('Error fetching search suggestions:', error)
			return { data: [], error }
		}
	}

	// Get related products
	async getRelatedProducts(productId, limit = 4) {
		if (this.useMockData) {
			const currentProduct = mockProducts.find((p) => p.id === productId)
			if (!currentProduct) return { data: [], error: null }

			const related = mockProducts
				.filter(
					(p) => p.id !== productId && p.category === currentProduct.category
				)
				.slice(0, limit)

			return { data: related, error: null }
		}

		try {
			// First get the current product's category
			const { data: currentProduct, error: currentError } = await supabase
				.from('products')
				.select('category_id')
				.eq('id', productId)
				.maybeSingle()  // 使用 maybeSingle() 避免 PGRST116 错误

			if (currentError) {
				throw currentError
			}

			if (!currentProduct) {
				return { data: [], error: null }
			}

			const { data, error } = await supabase
				.from('products')
				.select(
					`
          *,
          categories (
            id,
            name,
            slug
          )
        `
				)
				.eq('category_id', currentProduct.category_id)
				.neq('id', productId)
				.eq('is_active', true)
				.order('is_featured', { ascending: false })
				.limit(limit)

			return { data, error }
		} catch (error) {
			console.error('Error fetching related products:', error)
			return { data: [], error }
		}
	}

	// Get similar products (based on tags)
	async getSimilarProducts(productId, limit = 4) {
		if (this.useMockData) {
			const currentProduct = mockProducts.find((p) => p.id === productId)
			if (!currentProduct) return { data: [], error: null }

			const similar = mockProducts
				.filter((p) => {
					if (p.id === productId) return false
					return p.tags?.some((tag) => currentProduct.tags?.includes(tag))
				})
				.slice(0, limit)

			return { data: similar, error: null }
		}

		try {
			// Get current product tags
			const { data: currentProduct, error: currentError } = await supabase
				.from('products')
				.select('tags')
				.eq('id', productId)
				.single()

			// Handle case where product not found
			if (currentError && currentError.code === 'PGRST116') {
				return { data: [], error: null }
			}
			if (currentError) {
				throw currentError
			}

			if (!currentProduct || !currentProduct.tags) {
				return { data: [], error: null }
			}

			const { data, error } = await supabase
				.from('products')
				.select(
					`
          *,
          categories (
            id,
            name,
            slug
          )
        `
				)
				.overlaps('tags', currentProduct.tags)
				.neq('id', productId)
				.eq('is_active', true)
				.order('is_featured', { ascending: false })
				.limit(limit)

			return { data, error }
		} catch (error) {
			console.error('Error fetching similar products:', error)
			return { data: [], error }
		}
	}

	// Get popular products
	async getPopularProducts(limit = 4) {
		if (this.useMockData) {
			const popular = mockProducts
				.sort((a, b) => (b.rating || 0) - (a.rating || 0))
				.slice(0, limit)

			return { data: popular, error: null }
		}

			try {
				const { data, error } = await supabase
					.from('products')
					.select(
						`
          *,
          categories (
            id,
            name,
            slug
          )
        `
					)
					.eq('is_active', true)
					.order('average_rating', { ascending: false })
					.order('review_count', { ascending: false })
					.limit(limit)

			return { data, error }
		} catch (error) {
			console.error('Error fetching popular products:', error)
			return { data: [], error }
		}
	}

	// Get recently viewed products (requires user session)
	async getRecentlyViewed(userId, limit = 4) {
		// This would typically be stored in a separate table or user preferences
		// For now, return featured products as fallback
		return this.getFeaturedProducts(limit)
	}

	isInStock(product) {
		return product.inventoryQuantity > 0
	}

	// eslint-disable-next-line no-unused-vars
	getProductImageUrl(product, _size = 'medium') {
		if (!product.images || product.images.length === 0) {
			return '/placeholder-product.jpg'
		}

		// Return first image for now
		return product.images[0]
	}
}

// Create singleton instance
export const productService = new ProductService()
export default productService
