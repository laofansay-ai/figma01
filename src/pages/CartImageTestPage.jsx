import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/button'

const CartImageTestPage = () => {
	const { items, addToCart, summary } = useCart()
	const { user } = useAuth()
	const [testResults, setTestResults] = useState([])

	// 测试产品ID列表
	const testProducts = [
		'811d9cbf-f862-4545-aecf-e51bf1e03182', // 如果有真实的产品ID
		'test-product-1',
		'test-product-2'
	]

	const addTestResult = (test, result, details = '') => {
		setTestResults((prev) => [
			...prev,
			{
				test,
				result,
				details,
				timestamp: new Date().toLocaleTimeString()
			}
		])
	}

	const testAddToCart = async (productId) => {
		try {
			addTestResult('添加到购物车', '进行中', `尝试添加产品 ${productId}`)

			const result = await addToCart(productId, 1, {
				color: 'natural',
				size: 'wood'
			})

			if (result.success) {
				addTestResult('添加到购物车', '成功', `产品 ${productId} 添加成功`)
			} else {
				addTestResult(
					'添加到购物车',
					'失败',
					`产品 ${productId} 添加失败: ${result.error}`
				)
			}
		} catch (error) {
			addTestResult('添加到购物车', '错误', `异常: ${error.message}`)
		}
	}

	const testCartItemsDisplay = () => {
		addTestResult('购物车显示测试', '进行中', '检查购物车商品显示')

		if (items.length === 0) {
			addTestResult('购物车显示测试', '警告', '购物车为空，无法测试显示')
			return
		}

		let allItemsValid = true
		const issues = []

		items.forEach((item, index) => {
			const hasImage = item.product?.images?.[0] || item.image
			const hasPrice = item.product?.price || item.unitPrice || item.unit_price
			const hasName = item.product?.name || item.name

			if (!hasImage) {
				issues.push(`商品 ${index + 1}: 缺少图片`)
				allItemsValid = false
			}

			if (!hasPrice) {
				issues.push(`商品 ${index + 1}: 缺少价格`)
				allItemsValid = false
			}

			if (!hasName) {
				issues.push(`商品 ${index + 1}: 缺少名称`)
				allItemsValid = false
			}
		})

		if (allItemsValid) {
			addTestResult(
				'购物车显示测试',
				'成功',
				`所有 ${items.length} 个商品都有完整信息`
			)
		} else {
			addTestResult('购物车显示测试', '失败', issues.join('; '))
		}
	}

	const clearTestResults = () => {
		setTestResults([])
	}

	// 添加测试数据到购物车
	const addTestProductsToCart = () => {
		addTestResult('添加测试数据', '进行中', '正在添加测试产品数据')
		
		const testCartItems = [
			{
				id: Date.now().toString(),
				productId: 'test-product-1',
				quantity: 2,
				variantOptions: { color: 'brown', size: 'medium' },
				product: {
					id: 'test-product-1',
					name: '现代木质椅子',
					price: 299.99,
					images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'],
					slug: 'modern-wooden-chair'
				},
				addedAt: new Date().toISOString()
			},
			{
				id: (Date.now() + 1).toString(),
				productId: 'test-product-2',
				quantity: 1,
				variantOptions: { color: 'gray', size: 'large' },
				product: {
					id: 'test-product-2',
					name: '简约沙发',
					price: 899.99,
					images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'],
					slug: 'minimalist-sofa'
				},
				addedAt: new Date().toISOString()
			}
		]
		
		try {
			localStorage.setItem('ulmo_cart', JSON.stringify(testCartItems))
			addTestResult('添加测试数据', '成功', `已添加 ${testCartItems.length} 个测试产品，请刷新页面查看`)
			
			// 自动刷新购物车状态
			setTimeout(() => {
				window.location.reload()
			}, 1000)
			
		} catch (error) {
			addTestResult('添加测试数据', '失败', error.message)
		}
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-4">购物车图片和价格显示测试</h1>
				<p className="text-gray-600 mb-4">
					这个页面用于测试购物车功能是否正确显示商品图片和价格信息。
				</p>

				<div className="bg-blue-50 p-4 rounded-lg mb-6">
					<h3 className="font-medium text-blue-900 mb-2">当前状态:</h3>
					<p className="text-sm text-blue-800">
						用户: {user ? user.email : '未登录'}
					</p>
					<p className="text-sm text-blue-800">购物车商品数: {items.length}</p>
					<p className="text-sm text-blue-800">
						购物车总计: ${summary.total.toFixed(2)}
					</p>
				</div>
			</div>

			{/* 测试按钮 */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				<div className="space-y-2">
					<h3 className="font-medium text-gray-900">添加测试商品:</h3>
					{testProducts.map((productId, index) => (
						<Button
							key={productId}
							onClick={() => testAddToCart(productId)}
							className="w-full bg-blue-500 hover:bg-blue-600 text-white"
							size="sm"
						>
							添加测试商品 {index + 1}
						</Button>
					))}
				</div>

				<div className="space-y-2">
					<h3 className="font-medium text-gray-900">测试功能:</h3>
					<Button
						onClick={addTestProductsToCart}
						className="w-full bg-purple-500 hover:bg-purple-600 text-white"
						size="sm"
					>
						添加完整测试数据
					</Button>
					<Button
						onClick={testCartItemsDisplay}
						className="w-full bg-green-500 hover:bg-green-600 text-white"
						size="sm"
					>
						测试购物车显示
					</Button>
					<Button
						onClick={clearTestResults}
						className="w-full bg-gray-500 hover:bg-gray-600 text-white"
						size="sm"
					>
						清除测试结果
					</Button>
				</div>
			</div>

			{/* 购物车商品显示 */}
			<div className="mb-6">
				<h3 className="font-medium text-gray-900 mb-4">当前购物车商品:</h3>
				{items.length > 0 ? (
					<div className="space-y-4">
						{items.map((item, index) => (
							<div
								key={item.id || index}
								className="bg-white border border-gray-200 rounded-lg p-4"
							>
								<div className="flex items-start space-x-4">
									{/* 商品图片 */}
									<div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
										{(() => {
											const imageUrl = 
												item.product?.images?.[0] ||
												item.products?.images?.[0] ||
												item.image ||
												'/api/placeholder/80/80'
											
											console.log(`商品 ${index + 1} 图片URL:`, imageUrl)
											console.log(`商品 ${index + 1} 完整数据:`, item)
											
											return (
												<img
													src={imageUrl}
													alt={item.product?.name || item.name || '商品'}
													className="w-full h-full object-cover"
													onLoad={() => {
														console.log(`✅ 商品 ${index + 1} 图片加载成功:`, imageUrl)
													}}
													onError={(e) => {
														console.error(`❌ 商品 ${index + 1} 图片加载失败:`, e.target.src)
														e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkw0MCA0OEw1NiAzMkg1NlY1Nkg0MEg1NlY1NkgyNFYzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4KCg=='
													}}
												/>
											)
										})()}
									</div>

									{/* 商品信息 */}
									<div className="flex-1">
										<h4 className="font-medium text-gray-900 mb-1">
											{item.product?.name || item.name || '未知商品'}
										</h4>
										<p className="text-sm text-gray-500 mb-2">
											数量: {item.quantity}
										</p>
										<div className="text-sm text-gray-600">
											<p>
												单价: $
												{(
													item.product?.price ||
													item.unitPrice ||
													item.unit_price ||
													0
												).toFixed(2)}
											</p>
											<p>
												总价: $
												{(
													(item.product?.price ||
														item.unitPrice ||
														item.unit_price ||
														0) * item.quantity
												).toFixed(2)}
											</p>
										</div>
									</div>

									{/* 数据调试信息 */}
									<div className="text-xs text-gray-400 max-w-xs">
										<details>
											<summary className="cursor-pointer">调试信息</summary>
											<pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-auto">
												{JSON.stringify(
													{
														productId: item.productId || item.product_id,
														hasProduct: !!item.product,
														hasImage: !!(
															item.product?.images?.[0] || item.image
														),
														hasPrice: !!(
															item.product?.price ||
															item.unitPrice ||
															item.unit_price
														),
														variantOptions:
															item.variantOptions || item.variant_options
													},
													null,
													2
												)}
											</pre>
										</details>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-500 text-center py-8">购物车为空</p>
				)}
			</div>

			{/* 测试结果 */}
			<div>
				<h3 className="font-medium text-gray-900 mb-4">测试结果:</h3>
				{testResults.length > 0 ? (
					<div className="space-y-2 max-h-64 overflow-y-auto">
						{testResults.map((result, index) => (
							<div
								key={index}
								className={`p-3 rounded-lg text-sm ${
									result.result === '成功'
										? 'bg-green-50 text-green-800 border border-green-200'
										: result.result === '失败' || result.result === '错误'
										? 'bg-red-50 text-red-800 border border-red-200'
										: result.result === '警告'
										? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
										: 'bg-blue-50 text-blue-800 border border-blue-200'
								}`}
							>
								<div className="flex justify-between items-start">
									<div>
										<span className="font-medium">{result.test}: </span>
										<span
											className={`inline-block px-2 py-1 rounded text-xs ${
												result.result === '成功'
													? 'bg-green-200 text-green-800'
													: result.result === '失败' || result.result === '错误'
													? 'bg-red-200 text-red-800'
													: result.result === '警告'
													? 'bg-yellow-200 text-yellow-800'
													: 'bg-blue-200 text-blue-800'
											}`}
										>
											{result.result}
										</span>
									</div>
									<span className="text-xs text-gray-500">
										{result.timestamp}
									</span>
								</div>
								{result.details && (
									<p className="mt-1 text-xs">{result.details}</p>
								)}
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-500 text-center py-4">暂无测试结果</p>
				)}
			</div>
		</div>
	)
}

export default CartImageTestPage
