import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { getProductById } from '../data/mockProducts'
import { Button } from '@/components/ui/button'

const CartTestPage = () => {
	const { items, addToCart, getItemCount, summary } = useCart()
	const [testProductId, setTestProductId] = useState(1)
	const [testQuantity, setTestQuantity] = useState(1)
	const [message, setMessage] = useState('')

	const handleTestAddToCart = async () => {
		try {
			setMessage('正在添加商品到购物车...')
			const result = await addToCart(testProductId, testQuantity, {
				color: 'brown',
				size: 'medium'
			})

			if (result.success) {
				setMessage(`✅ 成功添加商品 ID ${testProductId} 到购物车！`)
			} else {
				setMessage(`❌ 添加失败: ${result.error}`)
			}
		} catch (error) {
			setMessage(`❌ 添加异常: ${error.message}`)
		}
	}

	const handleClearLocalStorage = () => {
		localStorage.removeItem('ulmo_cart')
		setMessage('🗑️ 已清空 localStorage 购物车数据')
		window.location.reload()
	}

	const testProduct = getProductById(testProductId)

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">购物车功能测试</h1>

			{/* 测试控制面板 */}
			<div className="bg-gray-100 p-4 rounded-lg mb-6">
				<h2 className="text-xl font-semibold mb-4">测试控制</h2>

				<div className="grid grid-cols-2 gap-4 mb-4">
					<div>
						<label className="block text-sm font-medium mb-2">产品 ID:</label>
						<select
							value={testProductId}
							onChange={(e) => setTestProductId(parseInt(e.target.value))}
							className="w-full p-2 border rounded"
						>
							{[1, 2, 3, 4, 5].map((id) => (
								<option key={id} value={id}>
									产品 {id}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">数量:</label>
						<input
							type="number"
							value={testQuantity}
							onChange={(e) => setTestQuantity(parseInt(e.target.value))}
							className="w-full p-2 border rounded"
							min="1"
						/>
					</div>
				</div>

				<div className="flex space-x-4">
					<Button onClick={handleTestAddToCart}>添加到购物车</Button>
					<Button onClick={handleClearLocalStorage} variant="outline">
						清空购物车
					</Button>
				</div>

				{message && (
					<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
						{message}
					</div>
				)}
			</div>

			{/* 测试产品信息 */}
			<div className="bg-white p-4 rounded-lg shadow mb-6">
				<h2 className="text-xl font-semibold mb-4">当前测试产品</h2>
				{testProduct ? (
					<div>
						<h3 className="font-medium">{testProduct.name}</h3>
						<p className="text-gray-600">${testProduct.price}</p>
						<p className="text-sm text-gray-500">ID: {testProduct.id}</p>
					</div>
				) : (
					<p className="text-red-600">产品未找到</p>
				)}
			</div>

			{/* 购物车状态 */}
			<div className="bg-white p-4 rounded-lg shadow mb-6">
				<h2 className="text-xl font-semibold mb-4">购物车状态</h2>

				<div className="grid grid-cols-3 gap-4 mb-4">
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">
							{getItemCount()}
						</div>
						<div className="text-sm text-gray-600">商品总数</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600">
							{items.length}
						</div>
						<div className="text-sm text-gray-600">不同商品</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-yellow-600">
							${summary.total.toFixed(2)}
						</div>
						<div className="text-sm text-gray-600">总金额</div>
					</div>
				</div>

				{/* 购物车商品列表 */}
				<div>
					<h3 className="font-medium mb-2">购物车商品:</h3>
					{items.length > 0 ? (
						<ul className="space-y-2">
							{items.map((item, index) => (
								<li
									key={index}
									className="flex justify-between items-center p-2 bg-gray-50 rounded"
								>
									<div>
										<span className="font-medium">
											{item.product?.name || `产品 ${item.productId}`}
										</span>
										<span className="text-gray-600 ml-2">
											x {item.quantity}
										</span>
									</div>
									<div className="text-right">
										<div>${item.totalPrice}</div>
										<div className="text-xs text-gray-500">
											{item.variantOptions.color} / {item.variantOptions.size}
										</div>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500">购物车为空</p>
					)}
				</div>
			</div>

			{/* localStorage 数据 */}
			<div className="bg-white p-4 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4">localStorage 数据</h2>
				<pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
					{localStorage.getItem('ulmo_cart') || '无数据'}
				</pre>
			</div>
		</div>
	)
}

export default CartTestPage
