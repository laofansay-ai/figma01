import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
	CheckCircle,
	XCircle,
	AlertCircle,
	User,
	Mail,
	Calendar
} from 'lucide-react'

const AuthTestPage = () => {
	const { user, loading, error, signUp, signIn, signOut, isAuthenticated } =
		useAuth()
	// const [testMode, setTestMode] = useState('login') // 'login', 'signup', 'info' - Reserved for future use
	const [testResults, setTestResults] = useState([])
	const [isRunning, setIsRunning] = useState(false)

	// 测试用的用户数据
	const testUser = {
		email: 'test@ulmo.com',
		password: 'test123456',
		full_name: 'Test User'
	}

	const addTestResult = (test, success, message) => {
		setTestResults((prev) => [
			...prev,
			{
				test,
				success,
				message,
				timestamp: new Date().toLocaleTimeString()
			}
		])
	}

	const clearResults = () => {
		setTestResults([])
	}

	// 测试注册功能
	const testSignUp = async () => {
		setIsRunning(true)
		addTestResult('注册测试', null, '开始测试用户注册...')

		try {
			const { error } = await signUp(testUser.email, testUser.password, {
				full_name: testUser.full_name
			})

			if (error) {
				addTestResult('注册测试', false, `注册失败: ${error}`)
			} else {
				addTestResult('注册测试', true, '注册成功！请检查邮箱进行验证')
			}
		} catch (err) {
			addTestResult('注册测试', false, `注册异常: ${err.message}`)
		}

		setIsRunning(false)
	}

	// 测试登录功能
	const testSignIn = async () => {
		setIsRunning(true)
		addTestResult('登录测试', null, '开始测试用户登录...')

		try {
			const { data, error } = await signIn(testUser.email, testUser.password)

			if (error) {
				addTestResult('登录测试', false, `登录失败: ${error}`)
			} else {
				addTestResult('登录测试', true, '登录成功！')
				addTestResult('会话检查', true, `用户ID: ${data.user?.id}`)
			}
		} catch (err) {
			addTestResult('登录测试', false, `登录异常: ${err.message}`)
		}

		setIsRunning(false)
	}

	// 测试登出功能
	const testSignOut = async () => {
		setIsRunning(true)
		addTestResult('登出测试', null, '开始测试用户登出...')

		try {
			await signOut()
			addTestResult('登出测试', true, '登出成功！')
		} catch (err) {
			addTestResult('登出测试', false, `登出异常: ${err.message}`)
		}

		setIsRunning(false)
	}

	// 运行完整的认证流程测试
	const runFullTest = async () => {
		clearResults()
		setIsRunning(true)

		addTestResult('完整测试', null, '开始完整的认证流程测试...')

		// 如果已登录，先登出
		if (isAuthenticated) {
			await testSignOut()
			await new Promise((resolve) => setTimeout(resolve, 1000))
		}

		// 测试登录（可能失败，用户可能不存在）
		await testSignIn()
		await new Promise((resolve) => setTimeout(resolve, 1000))

		// 如果登录失败，尝试注册
		if (!isAuthenticated) {
			await testSignUp()
			await new Promise((resolve) => setTimeout(resolve, 2000))

			// 注册后再次尝试登录
			await testSignIn()
		}

		addTestResult('完整测试', true, '测试流程完成')
		setIsRunning(false)
	}

	const getResultIcon = (success) => {
		if (success === null)
			return <AlertCircle className="text-blue-500" size={16} />
		return success ? (
			<CheckCircle className="text-green-500" size={16} />
		) : (
			<XCircle className="text-red-500" size={16} />
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 pb-20">
			{/* Header */}
			<header className="bg-white px-4 pt-12 pb-6 border-b">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">认证功能测试</h1>
				<p className="text-gray-600">测试登录、注册和认证流程</p>
			</header>

			{/* Current User Status */}
			<section className="px-4 py-6">
				<div className="bg-white rounded-2xl p-6 shadow-sm">
					<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
						<User className="mr-2" size={20} />
						当前用户状态
					</h2>

					{loading ? (
						<div className="flex items-center text-blue-600">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
							加载中...
						</div>
					) : isAuthenticated ? (
						<div className="space-y-2">
							<div className="flex items-center text-green-600">
								<CheckCircle size={16} className="mr-2" />
								已登录
							</div>
							<div className="text-sm text-gray-600 space-y-1">
								<div className="flex items-center">
									<Mail size={14} className="mr-2" />
									{user?.email}
								</div>
								<div className="flex items-center">
									<User size={14} className="mr-2" />
									{user?.user_metadata?.full_name || '未设置姓名'}
								</div>
								<div className="flex items-center">
									<Calendar size={14} className="mr-2" />
									注册时间: {new Date(user?.created_at).toLocaleDateString()}
								</div>
							</div>
						</div>
					) : (
						<div className="text-gray-500 flex items-center">
							<XCircle size={16} className="mr-2" />
							未登录
						</div>
					)}

					{error && (
						<div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-600 text-sm">{error}</p>
						</div>
					)}
				</div>
			</section>

			{/* Test Controls */}
			<section className="px-4 mb-6">
				<div className="bg-white rounded-2xl p-6 shadow-sm">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">测试控制</h2>

					<div className="grid grid-cols-2 gap-3 mb-4">
						<Button
							onClick={testSignUp}
							disabled={isRunning}
							variant="outline"
							className="w-full"
						>
							测试注册
						</Button>

						<Button
							onClick={testSignIn}
							disabled={isRunning}
							variant="outline"
							className="w-full"
						>
							测试登录
						</Button>

						<Button
							onClick={testSignOut}
							disabled={isRunning || !isAuthenticated}
							variant="outline"
							className="w-full"
						>
							测试登出
						</Button>

						<Button
							onClick={runFullTest}
							disabled={isRunning}
							className="w-full bg-yellow-500 hover:bg-yellow-600"
						>
							完整测试
						</Button>
					</div>

					<div className="flex justify-between text-sm">
						<span className="text-gray-600">测试用户: {testUser.email}</span>
						<Button
							onClick={clearResults}
							variant="ghost"
							size="sm"
							className="text-gray-500"
						>
							清除结果
						</Button>
					</div>
				</div>
			</section>

			{/* Test Results */}
			{testResults.length > 0 && (
				<section className="px-4 mb-6">
					<div className="bg-white rounded-2xl p-6 shadow-sm">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							测试结果
						</h2>

						<div className="space-y-3 max-h-64 overflow-y-auto">
							{testResults.map((result, index) => (
								<div
									key={index}
									className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
								>
									{getResultIcon(result.success)}
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between">
											<h3 className="text-sm font-medium text-gray-900">
												{result.test}
											</h3>
											<span className="text-xs text-gray-500">
												{result.timestamp}
											</span>
										</div>
										<p className="text-sm text-gray-600 mt-1">
											{result.message}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Quick Actions */}
			<section className="px-4">
				<div className="bg-white rounded-2xl p-6 shadow-sm">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>

					<div className="space-y-3">
						<a
							href="https://app.supabase.com"
							target="_blank"
							rel="noopener noreferrer"
							className="block w-full p-3 text-center bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
						>
							打开 Supabase 控制台
						</a>

						<button
							onClick={() => {
								console.log('User:', user)
								console.log('Auth state:', { isAuthenticated, loading, error })
							}}
							className="block w-full p-3 text-center bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
						>
							在控制台输出用户信息
						</button>
					</div>
				</div>
			</section>
		</div>
	)
}

export default AuthTestPage
