// 认证功能验证脚本
// 在浏览器控制台中运行此脚本来验证所有功能

console.log('🔍 开始验证认证功能...')

// 1. 检查环境变量
console.log('1. 检查环境变量配置:')
console.log(
	'   SUPABASE_URL:',
	import.meta.env.VITE_SUPABASE_URL ? '✅ 已配置' : '❌ 未配置'
)
console.log(
	'   SUPABASE_ANON_KEY:',
	import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置'
)

// 2. 检查Supabase客户端
console.log('2. 检查 Supabase 客户端:')
try {
	const { supabase } = await import('/src/lib/supabase.js')
	console.log('   Supabase 客户端:', supabase ? '✅ 已初始化' : '❌ 初始化失败')
} catch (error) {
	console.log('   Supabase 客户端: ❌ 导入失败', error.message)
}

// 3. 检查认证Hook
console.log('3. 检查认证 Hook:')
try {
	const { useAuth } = await import('/src/hooks/useAuth.js')
	console.log('   useAuth Hook:', useAuth ? '✅ 可用' : '❌ 不可用')
} catch (error) {
	console.log('   useAuth Hook: ❌ 导入失败', error.message)
}

// 4. 检查测试工具
console.log('4. 检查测试工具:')
try {
	const testModule = await import('/src/utils/supabaseTest.js')
	const tools = [
		'testSupabaseConnection',
		'validateEnvironment',
		'performHealthCheck'
	]
	tools.forEach((tool) => {
		console.log(`   ${tool}:`, testModule[tool] ? '✅ 可用' : '❌ 不可用')
	})
} catch (error) {
	console.log('   测试工具: ❌ 导入失败', error.message)
}

// 5. 检查认证组件
console.log('5. 检查认证组件:')
const components = ['LoginForm', 'SignUpForm', 'QuickLoginTest', 'AuthTestPage']

for (const component of components) {
	try {
		await import(`/src/components/auth/${component}.jsx`)
		console.log(`   ${component}: ✅ 可用`)
	} catch (error) {
		console.log(`   ${component}: ❌ 不可用`, error.message)
	}
}

// 6. 运行健康检查
console.log('6. 运行系统健康检查:')
try {
	const { performHealthCheck } = await import('/src/utils/supabaseTest.js')
	const results = await performHealthCheck()
	console.log(
		'   健康检查结果:',
		results.overall ? '✅ 系统正常' : '⚠️ 需要检查'
	)
	console.log('   详细结果:', results)
} catch (error) {
	console.log('   健康检查: ❌ 执行失败', error.message)
}

console.log('🎉 认证功能验证完成！')
console.log('📖 查看完整文档: /docs/login-testing-guide.md')
console.log('🧪 访问测试页面: /auth-test')
