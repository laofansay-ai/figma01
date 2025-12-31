import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
	ArrowLeft,
	Heart,
	Share,
	Star,
	Plus,
	Minus,
	ShoppingBag
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Button } from '@/components/ui/button'
import { productService } from '../services/productService'

const ProductDetail = () => {
	const { id } = useParams()
	const { addToCart } = useCart()
	 const [product, setProduct] = useState(null)
	 const [loading, setLoading] = useState(true)
	 const [error, setError] = useState(null)
	 const [quantity, setQuantity] = useState(1)
	 const [selectedImage, setSelectedImage] = useState(0)
	 const [selectedColor, setSelectedColor] = useState('')
	 const [selectedSize, setSelectedSize] = useState('')

	 // 从 Supabase 获取真实产品数据
	 useEffect(() => {
		 const loadProduct = async () => {
			 try {
				 setLoading(true)
				 let result
				 
				 // 先尝试通过数字 ID 查找，如果失败则尝试通过 slug 查找
				 if (id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
					 // UUID format - search by ID
					 result = await productService.getProductById(id)
				 } else {
					 // Slug format - search by slug
					 result = await productService.getProductBySlug(id)
				 }
				 
				 if (result.error || !result.data) {
					 setError('Product not found')
				 } else {
					 const productData = result.data
					 setProduct({
						 ...productData,
						 // 适配现有的UI结构
						 originalPrice: productData.compare_price,
						 reviews: productData.review_count || 0, // 评价数量
						 rating: productData.average_rating || 4.5, // 平均评分
						 colors: [
							 { name: 'brown', color: '#8B4513', available: true },
							 { name: 'black', color: '#000000', available: true },
							 { name: 'white', color: '#FFFFFF', available: true }
						 ],
						 sizes: [
							 { name: 'small', available: true },
							 { name: 'medium', available: true },
							 { name: 'large', available: true }
						 ],
						 features: [
							 'Premium construction',
							 'Modern design',
							 'High-quality materials',
							 'Durable and long-lasting',
							 '1-year warranty included'
						 ],
						 inStock: productData.inventory_quantity > 0
					 })
					 
					 // 设置默认选项
					 if (productData.variants?.colors?.length > 0) {
						 setSelectedColor(productData.variants.colors[0])
					 }
					 if (productData.variants?.materials?.length > 0) {
						 setSelectedSize(productData.variants.materials[0])
					 }
				 }
			 } catch (err) {
				 console.error('Error loading product:', err)
				 setError('Failed to load product')
			 } finally {
				 setLoading(false)
			 }
		 }
		 
		 loadProduct()
	 }, [id])

	// 加载和错误状态处理
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading product...</p>
				</div>
			</div>
		)
	}

	if (error || !product) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						{error || 'Product Not Found'}
					</h1>
					<Link to="/" className="text-yellow-500 hover:text-yellow-600">
						Go Home
					</Link>
				</div>
			</div>
		)
	}

	const reviews = [
		{
			id: 1,
			user: 'Sarah M.',
			rating: 5,
			comment:
				'Absolutely love this chair! Great quality and very comfortable.',
			date: '2024-01-15'
		},
		{
			id: 2,
			user: 'John D.',
			rating: 4,
			comment: 'Good chair, exactly as described. Fast delivery too.',
			date: '2024-01-10'
		},
		{
			id: 3,
			user: 'Emma L.',
			rating: 5,
			comment: 'Perfect for my home office. Highly recommend!',
			date: '2024-01-05'
		}
	]

	const handleAddToCart = async () => {
		try {
			// 使用 product.id 而不是整个 product 对象
			const result = await addToCart(product.id, quantity, {
				color: selectedColor,
				size: selectedSize
			})
			if (result.success) {
				// 添加成功反馈
				console.log('Product added to cart successfully!')
				console.log(
					'Current cart items in localStorage:',
					localStorage.getItem('ulmo_cart')
				)
			} else {
				console.error('Failed to add product to cart:', result.error)
			}
		} catch (error) {
			console.error('Error adding product to cart:', error)
		}
	}

	const incrementQuantity = () => setQuantity((prev) => prev + 1)
	const decrementQuantity = () =>
		setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

	return (
		<div className="pb-20 bg-white min-h-screen">
			{/* Header */}
			<header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
				<div className="flex items-center justify-between">
					<Link to="/products" className="p-2 rounded-full hover:bg-gray-100">
						<ArrowLeft size={24} className="text-gray-700" />
					</Link>
					<div className="flex items-center space-x-2">
						<button className="p-2 rounded-full hover:bg-gray-100">
							<Share size={24} className="text-gray-700" />
						</button>
						<button className="p-2 rounded-full hover:bg-gray-100">
							<Heart size={24} className="text-gray-700" />
						</button>
					</div>
				</div>
			</header>

			{/* Product Images */}
			<section className="px-4 py-6">
				<div className="mb-4">
					<div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden mb-4">
						<img
							src={product.images[selectedImage]}
							alt={product.name}
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="flex space-x-2 overflow-x-auto">
						{product.images.map((image, index) => (
							<button
								key={index}
								onClick={() => setSelectedImage(index)}
								className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 ${
									selectedImage === index
										? 'border-yellow-500'
										: 'border-gray-200'
								}`}
							>
								<img
									src={image}
									alt={`${product.name} ${index + 1}`}
									className="w-full h-full object-cover"
								/>
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Product Info */}
			<section className="px-4 mb-6">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm text-gray-500">{product.category}</span>
					<div className="flex items-center">
						<Star size={16} className="text-yellow-400 fill-current" />
						<span className="text-sm text-gray-600 ml-1">
							{product.rating} ({product.reviews} reviews)
						</span>
					</div>
				</div>

				<h1 className="text-2xl font-bold text-gray-900 mb-4">
					{product.name}
				</h1>

				<div className="flex items-center mb-4">
					<span className="text-3xl font-bold text-yellow-500">
						${product.price}
					</span>
					{product.originalPrice && (
						<span className="text-xl text-gray-400 line-through ml-3">
							${product.originalPrice}
						</span>
					)}
					{product.originalPrice && (
						<span className="ml-3 bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
							Save ${product.originalPrice - product.price}
						</span>
					)}
				</div>

				<p className="text-gray-600 leading-relaxed mb-6">
					{product.description}
				</p>

				{/* Color Selection */}
				<div className="mb-6">
					<h3 className="font-semibold text-gray-900 mb-3">Color</h3>
					<div className="flex space-x-3">
						{product.colors.map((color) => (
							<button
								key={color.name}
								onClick={() => color.available && setSelectedColor(color.name)}
								disabled={!color.available}
								className={`w-10 h-10 rounded-full border-2 ${
									selectedColor === color.name
										? 'border-yellow-500 scale-110'
										: 'border-gray-300'
								} ${
									!color.available ? 'opacity-50 cursor-not-allowed' : ''
								} transition-all`}
								style={{ backgroundColor: color.color }}
							/>
						))}
					</div>
				</div>

				{/* Size Selection */}
				<div className="mb-6">
					<h3 className="font-semibold text-gray-900 mb-3">Size</h3>
					<div className="flex space-x-3">
						{product.sizes.map((size) => (
							<button
								key={size.name}
								onClick={() => size.available && setSelectedSize(size.name)}
								disabled={!size.available}
								className={`px-4 py-2 rounded-xl border ${
									selectedSize === size.name
										? 'border-yellow-500 bg-yellow-50 text-yellow-700'
										: 'border-gray-300 text-gray-700'
								} ${
									!size.available ? 'opacity-50 cursor-not-allowed' : ''
								} transition-colors`}
							>
								{size.name.charAt(0).toUpperCase() + size.name.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Quantity */}
				<div className="mb-6">
					<h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
					<div className="flex items-center space-x-4">
						<div className="flex items-center border border-gray-300 rounded-xl">
							<button
								onClick={decrementQuantity}
								className="p-3 hover:bg-gray-100 rounded-l-xl"
							>
								<Minus size={16} />
							</button>
							<span className="px-4 py-3 font-medium">{quantity}</span>
							<button
								onClick={incrementQuantity}
								className="p-3 hover:bg-gray-100 rounded-r-xl"
							>
								<Plus size={16} />
							</button>
						</div>
						<span className="text-gray-600">
							{product.inStock ? 'In Stock' : 'Out of Stock'}
						</span>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="px-4 mb-6">
				<h3 className="font-semibold text-gray-900 mb-3">Features</h3>
				<div className="space-y-2">
					{product.features.map((feature, index) => (
						<div key={index} className="flex items-center">
							<div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
							<span className="text-gray-600">{feature}</span>
						</div>
					))}
				</div>
			</section>

			{/* Reviews */}
			<section className="px-4 mb-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-semibold text-gray-900">
						Reviews ({product.reviews})
					</h3>
					<Link to="#" className="text-yellow-500 font-medium">
						See all
					</Link>
				</div>
				<div className="space-y-4">
					{reviews.slice(0, 2).map((review) => (
						<div key={review.id} className="border-b border-gray-100 pb-4">
							<div className="flex items-center justify-between mb-2">
								<span className="font-medium text-gray-900">{review.user}</span>
								<div className="flex items-center">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											size={14}
											className={`${
												i < review.rating
													? 'text-yellow-400 fill-current'
													: 'text-gray-300'
											}`}
										/>
									))}
								</div>
							</div>
							<p className="text-gray-600 text-sm">{review.comment}</p>
						</div>
					))}
				</div>
			</section>

			{/* Add to Cart Button */}
			<div className="fixed bottom-20 left-0 right-0 px-4 py-4 bg-white border-t border-gray-100">
				<Button
					onClick={handleAddToCart}
					disabled={!product.inStock}
					className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2"
				>
					<ShoppingBag size={20} />
					<span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
				</Button>
			</div>
		</div>
	)
}

export default ProductDetail
