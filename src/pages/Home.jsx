import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
	Bell,
	Heart,
	Star,
	ShoppingBag,
	TrendingUp,
	Zap,
	Shield,
	Truck
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { useCart } from '../context/CartContext'
import { productService } from '../services/productService'

const Home = () => {
	const { addToCart } = useCart()
	const [featuredProducts, setFeaturedProducts] = useState([])
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadData = async () => {
			try {
				// Load featured products
				const { data: featured } = await productService.getFeaturedProducts(4)
				if (featured) {
					setFeaturedProducts(featured)
				}

				// Load categories
				const { data: categoriesData } = await productService.getCategories()
				if (categoriesData) {
					setCategories(categoriesData)
				}
			} catch (error) {
				console.error('Error loading home page data:', error)
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [])

	const handleAddToCart = (product) => {
		addToCart(product.id, 1, {}) // 使用产品ID而不是对象
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

	if (loading) {
		return (
			<div className="pb-20 bg-gradient-to-b from-yellow-50 to-white min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="pb-20 bg-gradient-to-b from-yellow-50 to-white min-h-screen">
			{/* Header */}
			<header className="px-4 pt-12 pb-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">ULMO</h1>
						<p className="text-gray-600 text-sm">Modern furniture & decor</p>
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
				<SearchBar className="mb-6" />

				{/* Hero Banner */}
				<div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-6 mb-6 text-white">
					<div className="flex items-center justify-between">
						<div className="flex-1">
							<h2 className="text-2xl font-bold mb-2">New Collection</h2>
							<p className="text-yellow-100 mb-4">
								Discover our latest furniture designs
							</p>
							<Button className="bg-white text-yellow-500 hover:bg-yellow-50 font-semibold">
								Shop Now
							</Button>
						</div>
						<div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
							<TrendingUp size={32} className="text-white" />
						</div>
					</div>
				</div>
			</header>

			{/* Categories */}
			<section className="px-4 mb-8">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-bold text-gray-900">Categories</h3>
					<Link to="/categories" className="text-yellow-500 font-medium">
						See All
					</Link>
				</div>
				<div className="grid grid-cols-2 gap-4">
					{categories.map((category, index) => (
						<Link
							key={category.id || index}
							to={`/categories/${category.slug}`}
							className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="text-3xl mb-2">{category.icon}</div>
							<h4 className="font-semibold text-gray-900 mb-1">
								{category.name}
							</h4>
							<p className="text-sm text-gray-500">
								{category.productCount || 0} items
							</p>
						</Link>
					))}
				</div>
			</section>

			{/* Featured Products */}
			<section className="px-4 mb-8">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-bold text-gray-900">Featured Products</h3>
					<Link to="/products" className="text-yellow-500 font-medium">
						See All
					</Link>
				</div>
				<div className="grid grid-cols-2 gap-4">
					{featuredProducts.map((product) => (
						<div
							key={product.id}
							className="bg-white rounded-2xl overflow-hidden shadow-sm"
						>
							<div className="relative">
								<img
									src={product.images?.[0] || '/api/placeholder/300/300'}
									alt={product.name}
									className="w-full h-40 object-cover"
								/>
								{product.compare_price && (
									<div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
										-{calculateDiscount(product.price, product.compare_price)}%
									</div>
								)}
								<button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full">
									<Heart size={16} className="text-gray-600" />
								</button>
							</div>
							<div className="p-4">
								<Link to={`/products/${product.slug || product.id}`}>
									<h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
										{product.name}
									</h4>
								</Link>
								<p className="text-sm text-gray-500 mb-2">{product.categories?.name || 'No category'}</p>

										{product.average_rating && (
											<div className="flex items-center mb-2">
												<div className="flex items-center">
													<Star
														size={14}
														className="text-yellow-400 fill-current"
													/>
													<span className="text-sm text-gray-600 ml-1">
														{product.average_rating}
													</span>
												</div>
												{product.review_count && (
													<span className="text-sm text-gray-400 ml-1">
														({product.review_count})
													</span>
												)}
											</div>
										)}

								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<span className="text-lg font-bold text-gray-900">
											{formatPrice(product.price)}
										</span>
										{product.compare_price && (
											<span className="text-sm text-gray-400 line-through">
												{formatPrice(product.compare_price)}
											</span>
										)}
									</div>
									<button
										onClick={() => handleAddToCart(product)}
										className="p-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
									>
										<ShoppingBag size={16} />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Features */}
			<section className="px-4 mb-8">
				<div className="grid grid-cols-3 gap-4">
					<div className="text-center">
						<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
							<Truck size={20} className="text-yellow-600" />
						</div>
						<p className="text-sm font-medium text-gray-900">Free Shipping</p>
						<p className="text-xs text-gray-500">On orders over $100</p>
					</div>
					<div className="text-center">
						<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
							<Shield size={20} className="text-yellow-600" />
						</div>
						<p className="text-sm font-medium text-gray-900">Secure Payment</p>
						<p className="text-xs text-gray-500">100% protected</p>
					</div>
					<div className="text-center">
						<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
							<Zap size={20} className="text-yellow-600" />
						</div>
						<p className="text-sm font-medium text-gray-900">Fast Delivery</p>
						<p className="text-xs text-gray-500">2-3 business days</p>
					</div>
				</div>
			</section>

			{/* Popular Products Recommendations */}
			<ProductRecommendations
				type="popular"
				title="Popular This Week"
				limit={4}
			/>
		</div>
	)
}

export default Home
