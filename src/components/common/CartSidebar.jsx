import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
	X,
	ShoppingBag,
	Plus,
	Minus,
	Trash2,
	ArrowRight,
	Heart,
	ShoppingCart
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/button'

const CartSidebar = ({ isOpen, onClose }) => {
	const { items, updateQuantity, removeFromCart, clearCart, summary } =
		useCart()
	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()

	const [removingItems, setRemovingItems] = useState(new Set())

	const handleCheckout = () => {
		if (!isAuthenticated) {
			// 如果未登录，先跳转到登录页面
			onClose()
			navigate('/account')
			return
		}
		
		if (items.length === 0) {
			alert('购物车为空，请先添加商品')
			return
		}
		
		// 直接跳转到结账页面
		onClose()
		navigate('/checkout')
	}

	const formatPrice = (price) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(price)
	}

	const handleQuantityChange = (itemId, newQuantity) => {
		if (newQuantity === 0) {
			handleRemoveItem(itemId)
		} else {
			updateQuantity(itemId, newQuantity)
		}
	}

	const handleRemoveItem = (itemId) => {
		setRemovingItems((prev) => new Set(prev).add(itemId))

		// Add a small delay for animation
		setTimeout(() => {
			removeFromCart(itemId)
			setRemovingItems((prev) => {
				const newSet = new Set(prev)
				newSet.delete(itemId)
				return newSet
			})
		}, 300)
	}

	const subtotal = summary.subtotal
	const tax = summary.tax
	const shipping = summary.shipping
	const total = summary.total

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
					<div className="flex items-center">
						<ShoppingBag size={24} className="text-gray-700 mr-3" />
						<h2 className="text-xl font-bold text-gray-900">
							Shopping Cart ({summary.itemCount})
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} className="text-gray-600" />
					</button>
				</div>

				{/* Cart Content */}
				<div className="flex flex-col flex-1 min-h-0">
					{items.length === 0 ? (
						/* Empty Cart */
						<div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
							<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
								<ShoppingCart size={32} className="text-gray-400" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Your cart is empty
							</h3>
							<p className="text-gray-500 mb-6">
								Add some products to get started
							</p>
							<Button
								onClick={onClose}
								className="bg-yellow-500 hover:bg-yellow-600 text-white px-6"
							>
								Continue Shopping
							</Button>
						</div>
					) : (
						<>
							{/* Cart Items */}
							<div className="flex-1 overflow-y-auto p-6 space-y-4 pb-4">
								{items.map((item) => {
									// 调试信息 - 在控制台输出商品数据
									console.log('CartSidebar - Item data:', {
										id: item.id,
										productId: item.productId,
										product: item.product,
										products: item.products,
										image: item.image,
										price: item.price,
										unitPrice: item.unitPrice,
										unit_price: item.unit_price,
										hasProductImages: !!(item.product?.images || item.products?.images),
										imageSrc: item.product?.images?.[0] || item.products?.images?.[0] || item.image
									});
									
									return (
										<div
										key={item.id}
										className={`
                      bg-white border border-gray-200 rounded-xl p-4 transition-all duration-300
                      ${
												removingItems.has(item.id)
													? 'opacity-50 scale-95'
													: 'opacity-100 scale-100'
											}
                    `}
									>
										<div className="flex items-start space-x-4">
											{/* Product Image */}
											<div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
												<img
													src={
														item.product?.images?.[0] || 
														item.products?.images?.[0] || 
														item.image || 
														'/api/placeholder/80/80'
													}
													alt={item.product?.name || item.products?.name || item.name || '商品'}
													className="w-full h-full object-cover"
													onError={(e) => {
														console.error('商品图片加载失败:', e.target.src)
														e.target.src = '/api/placeholder/80/80'
													}}
												/>
											</div>

											{/* Product Info */}
											<div className="flex-1 min-w-0">
												<Link
													to={`/products/${item.product?.slug || item.products?.slug || item.slug || item.productId || item.product_id}`}
													onClick={onClose}
													className="text-sm font-semibold text-gray-900 hover:text-yellow-600 transition-colors line-clamp-2"
												>
													{item.product?.name || item.products?.name || item.name || '未知商品'}
												</Link>

												{(item.variantOptions || item.variant_options) && (
													<p className="text-xs text-gray-500 mt-1">
														{(item.variantOptions || item.variant_options)?.color &&
															`Color: ${(item.variantOptions || item.variant_options).color}`}
														{(item.variantOptions || item.variant_options)?.size &&
															` • Size: ${(item.variantOptions || item.variant_options).size}`}
													</p>
												)}

												<div className="flex items-center justify-between mt-3">
													{/* Quantity Controls */}
													<div className="flex items-center space-x-2">
														<button
															onClick={() =>
																handleQuantityChange(item.id, item.quantity - 1)
															}
															className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
															disabled={item.quantity <= 1}
														>
															<Minus size={14} className="text-gray-600" />
														</button>

														<span className="w-8 text-center text-sm font-medium text-gray-900">
															{item.quantity}
														</span>

														<button
															onClick={() =>
																handleQuantityChange(item.id, item.quantity + 1)
															}
															className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
														>
															<Plus size={14} className="text-gray-600" />
														</button>
													</div>

													{/* Price */}
													<div className="text-right">
														<p className="text-sm font-bold text-gray-900">
															{formatPrice((
																item.product?.price || 
																item.products?.price || 
																item.unitPrice || 
																item.unit_price || 
																item.price || 
																0
															) * item.quantity)}
														</p>
														{item.quantity > 1 && (
															<p className="text-xs text-gray-500">
																{formatPrice(
																	item.product?.price || 
																	item.products?.price || 
																	item.unitPrice || 
																	item.unit_price || 
																	item.price || 
																	0
																)} each
															</p>
														)}
													</div>
												</div>
											</div>

											{/* Remove Button */}
											<button
												onClick={() => handleRemoveItem(item.id)}
												className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
												title="Remove item"
											>
												<Trash2
													size={16}
													className="text-gray-400 group-hover:text-red-500"
												/>
											</button>
										</div>
									</div>
								)
							})}
							</div>

							{/* Cart Summary */}
							<div className="border-t border-gray-200 p-6 space-y-4 flex-shrink-0 bg-white">
								{/* Clear Cart */}
								{items.length > 0 && (
									<button
										onClick={clearCart}
										className="text-sm text-red-500 hover:text-red-600 transition-colors"
									>
										Clear cart
									</button>
								)}

								{/* Price Breakdown */}
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Subtotal</span>
										<span className="text-gray-900">
											{formatPrice(subtotal)}
										</span>
									</div>

									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Tax</span>
										<span className="text-gray-900">{formatPrice(tax)}</span>
									</div>

									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Shipping</span>
										<span className="text-gray-900">
											{shipping === 0 ? 'Free' : formatPrice(shipping)}
										</span>
									</div>

									{shipping === 0 && subtotal > 0 && (
										<p className="text-xs text-green-600">
											🎉 You qualify for free shipping!
										</p>
									)}

									{shipping > 0 && (
										<p className="text-xs text-gray-500">
											Add {formatPrice(100 - subtotal)} more for free shipping
										</p>
									)}

									<div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
										<span className="text-gray-900">Total</span>
										<span className="text-gray-900">{formatPrice(total)}</span>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="space-y-3 pb-20">
									<Button 
										onClick={handleCheckout}
										className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3"
									>
										{isAuthenticated ? 'Checkout Now' : 'Sign In to Checkout'}
										<ArrowRight size={16} className="ml-2" />
									</Button>

									<Link to="/cart" onClick={onClose}>
										<Button 
											variant="outline"
											className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
										>
											View Cart Details
										</Button>
									</Link>

									<Button
										variant="outline"
										onClick={onClose}
										className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
									>
										Continue Shopping
									</Button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	)
}

export default CartSidebar