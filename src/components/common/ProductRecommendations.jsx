import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Heart, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { productService } from '../../services/productService'

const ProductRecommendations = ({
	currentProduct = null,
	userId = null,
	limit = 4,
	title = 'You might also like',
	type = 'related' // "related", "similar", "popular", "recently_viewed"
}) => {
	const { addToCart } = useCart()
	const [recommendations, setRecommendations] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadRecommendations = async () => {
			setLoading(true)
			try {
				let result

				switch (type) {
					case 'related':
						if (currentProduct) {
							result = await productService.getRelatedProducts(
								currentProduct.id,
								limit
							)
						}
						break
					case 'similar':
						if (currentProduct) {
							result = await productService.getSimilarProducts(
								currentProduct.id,
								limit
							)
						}
						break
					case 'popular':
						result = await productService.getPopularProducts(limit)
						break
					case 'recently_viewed':
						if (userId) {
							result = await productService.getRecentlyViewed(userId, limit)
						}
						break
					default:
						result = await productService.getFeaturedProducts(limit)
				}

				if (result?.data) {
					setRecommendations(result.data)
				}
			} catch (error) {
				console.error('Error loading recommendations:', error)
			} finally {
				setLoading(false)
			}
		}

		loadRecommendations()
	}, [currentProduct, userId, limit, type])

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

	const handleAddToCart = (product) => {
		addToCart({
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.images?.[0] || '/api/placeholder/300/300',
			quantity: 1
		})
	}

	const getIcon = () => {
		switch (type) {
			case 'popular':
				return <TrendingUp size={20} className="text-yellow-600" />
			case 'recently_viewed':
				return <Users size={20} className="text-blue-600" />
			default:
				return <Heart size={20} className="text-pink-600" />
		}
	}

	if (loading) {
		return (
			<section className="px-4 mb-8">
				<div className="flex items-center mb-4">
					{getIcon()}
					<h3 className="text-xl font-bold text-gray-900 ml-2">{title}</h3>
				</div>
				<div className="grid grid-cols-2 gap-4">
					{Array.from({ length: limit }, (_, i) => (
						<div
							key={i}
							className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
						>
							<div className="h-40 bg-gray-200"></div>
							<div className="p-4 space-y-2">
								<div className="h-4 bg-gray-200 rounded w-3/4"></div>
								<div className="h-3 bg-gray-200 rounded w-1/2"></div>
								<div className="h-6 bg-gray-200 rounded w-1/3"></div>
							</div>
						</div>
					))}
				</div>
			</section>
		)
	}

	if (!recommendations.length) {
		return null
	}

	return (
		<section className="px-4 mb-8">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center">
					{getIcon()}
					<h3 className="text-xl font-bold text-gray-900 ml-2">{title}</h3>
				</div>
				{recommendations.length > limit && (
					<Link
						to="/products"
						className="text-yellow-500 font-medium hover:text-yellow-600 transition-colors"
					>
						See All
					</Link>
				)}
			</div>

			<div className="grid grid-cols-2 gap-4">
				{recommendations.slice(0, limit).map((product) => (
					<div
						key={product.id}
						className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
					>
						<div className="relative">
							<Link to={`/products/${product.slug || product.id}`}>
								<img
									src={product.images?.[0] || '/api/placeholder/300/300'}
									alt={product.name}
									className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
								/>
							</Link>

							{/* Discount Badge */}
							{product.comparePrice && (
								<div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
									-{calculateDiscount(product.price, product.comparePrice)}%
								</div>
							)}

							{/* Wishlist Button */}
							<button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
								<Heart size={16} className="text-gray-600" />
							</button>

							{/* Quick Add Button */}
							<button
								onClick={() => handleAddToCart(product)}
								className="absolute bottom-2 right-2 p-2 bg-yellow-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
							>
								<ShoppingBag size={16} />
							</button>
						</div>

						<div className="p-4">
							<Link to={`/products/${product.slug || product.id}`}>
								<h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-yellow-600 transition-colors">
									{product.name}
								</h4>
							</Link>

							<p className="text-sm text-gray-500 mb-2">{product.category}</p>

							{/* Rating */}
							{product.rating && (
								<div className="flex items-center mb-2">
									<div className="flex items-center">
										<Star size={14} className="text-yellow-400 fill-current" />
										<span className="text-sm text-gray-600 ml-1">
											{product.rating}
										</span>
									</div>
									{product.reviewCount && (
										<span className="text-sm text-gray-400 ml-1">
											({product.reviewCount})
										</span>
									)}
								</div>
							)}

							{/* Price */}
							<div className="flex items-center justify-between">
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
							</div>

							{/* Stock Status */}
							{product.inventoryQuantity !== undefined && (
								<div className="mt-2">
									{product.inventoryQuantity === 0 ? (
										<span className="text-sm text-red-500 font-medium">
											Out of stock
										</span>
									) : product.inventoryQuantity < 5 ? (
										<span className="text-sm text-orange-500">
											Only {product.inventoryQuantity} left
										</span>
									) : (
										<span className="text-sm text-green-600">In stock</span>
									)}
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Show more button for large recommendations */}
			{recommendations.length > 4 && (
				<div className="mt-6 text-center">
					<Link
						to={`/products${
							currentProduct ? `?category=${currentProduct.category}` : ''
						}`}
						className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
					>
						View More Recommendations
						<TrendingUp size={16} className="ml-2" />
					</Link>
				</div>
			)}
		</section>
	)
}

export default ProductRecommendations
