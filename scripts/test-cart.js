// 购物车功能测试脚本
// 在浏览器控制台中运行此脚本来测试购物车功能

console.log('🛒 开始测试购物车功能...')

// 测试 CartContext 导入
try {
	const cartModule = await import('/src/context/CartContext.jsx')
	console.log('✅ CartContext 导入成功')
	console.log('   可用方法:', Object.keys(cartModule))
} catch (error) {
	console.log('❌ CartContext 导入失败:', error.message)
}

// 测试 CartService 导入
try {
	const serviceModule = await import('/src/services/cartService.js')
	console.log('✅ CartService 导入成功')
	console.log(
		'   CartService 实例:',
		serviceModule.cartService ? '已创建' : '未创建'
	)
} catch (error) {
	console.log('❌ CartService 导入失败:', error.message)
}

// 测试 ProductService 导入
try {
	const productModule = await import('/src/services/productService.js')
	console.log('✅ ProductService 导入成功')
	console.log(
		'   ProductService 实例:',
		productModule.productService ? '已创建' : '未创建'
	)
} catch (error) {
	console.log('❌ ProductService 导入失败:', error.message)
}

// 测试本地存储购物车功能
try {
	const { cartService } = await import('/src/services/cartService.js')

	// 清空购物车
	console.log('🧹 清空购物车...')
	await cartService.clearLocalCart()

	// 添加测试商品
	console.log('➕ 添加测试商品...')
	await cartService.addToLocalCart('test-product-1', 2, {
		color: 'red',
		size: 'M'
	})
	await cartService.addToLocalCart('test-product-2', 1, {})

	// 获取购物车内容
	console.log('📋 获取购物车内容...')
	const { data: items } = cartService.getLocalCartItems()
	console.log('   购物车商品数量:', items.length)

	// 计算购物车摘要
	console.log('📊 计算购物车摘要...')
	const summary = cartService.calculateCartSummary(items)
	console.log('   摘要信息:', summary)

	console.log('✅ 购物车基本功能测试通过')
} catch (error) {
	console.log('❌ 购物车功能测试失败:', error.message)
}

console.log('🎉 购物车功能测试完成！')
console.log('💡 现在可以在应用中测试以下功能:')
console.log('   - 点击底部导航的购物车图标')
console.log('   - 查看购物车侧边栏')
console.log('   - 添加商品到购物车')
console.log('   - 修改商品数量')
console.log('   - 删除购物车商品')
