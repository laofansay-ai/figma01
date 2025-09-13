import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/button'
import { User, Mail, Eye, EyeOff, Activity, AlertTriangle } from 'lucide-react'
import {
	performHealthCheck,
	formatHealthCheckResults
} from '../../utils/supabaseTest'

const QuickLoginTest = () => {
	const { signIn, signUp, signOut, user, isAuthenticated, loading, error } =
		useAuth()
	const [testEmail, setTestEmail] = useState('test@ulmo.com')
	const [testPassword, setTestPassword] = useState('test123456')
	const [showPassword, setShowPassword] = useState(false)
	const [message, setMessage] = useState('')
	const [isRunning, setIsRunning] = useState(false)
	const [healthCheck, setHealthCheck] = useState(null)
	const [showHealthCheck, setShowHealthCheck] = useState(false)

	// 在组件加载时进行健康检查
	useEffect(() => {
		const runHealthCheck = async () => {
			const results = await performHealthCheck()
			setHealthCheck(results)
		}
		runHealthCheck()
	}, [])

	const handleQuickSignUp = async () => {
		setIsRunning(true)
		setMessage('正在注册测试用户...')

		try {
			const { error } = await signUp(testEmail, testPassword, {
				full_name: 'Test User'
			})

			if (error) {
				setMessage(`注册失败: ${error}`)
			} else {
				setMessage('注册成功！请检查邮箱验证邮件（如果开启了邮箱验证）')
			}
		} catch (err) {
			setMessage(`注册错误: ${err.message}`)
		}

		setIsRunning(false)
	}

	const handleQuickSignIn = async () => {
		setIsRunning(true)
		setMessage('正在登录...')

		try {
			const { error } = await signIn(testEmail, testPassword)

			if (error) {
				setMessage(`登录失败: ${error}`)
			} else {
				setMessage('登录成功！')
			}
		} catch (err) {
			setMessage(`登录错误: ${err.message}`)
		}

		setIsRunning(false)
	}

	const handleSignOut = async () => {
		setIsRunning(true)
		setMessage('正在登出...')

		try {
			await signOut()
			setMessage('登出成功')
		} catch (err) {
			setMessage(`登出错误: ${err.message}`)
		}

		setIsRunning(false)
	}

	return (
		<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
			<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
				<User className="mr-2" size={20} />
				登录测试工具
			</h3>

			{/* 系统状态 */}
			{healthCheck && (
				<div className="mb-4">
					<Button
						onClick={() => setShowHealthCheck(!showHealthCheck)}
						variant="ghost"
						size="sm"
						className="w-full text-left flex items-center justify-between p-2 hover:bg-gray-50"
					>
						<span className="flex items-center text-sm">
							<Activity size={16} className="mr-2" />
							系统状态 {healthCheck.overall ? '✅' : '⚠️'}
						</span>
						{showHealthCheck ? '▲' : '▼'}
					</Button>

					{showHealthCheck && (
						<div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs space-y-1">
							{formatHealthCheckResults(healthCheck).map((msg, idx) => (
								<div
									key={idx}
									className={`
                  ${
										msg.startsWith('✅')
											? 'text-green-600'
											: msg.startsWith('❌')
											? 'text-red-600'
											: msg.startsWith('⚠️')
											? 'text-orange-600'
											: 'text-gray-600'
									}
                `}
								>
									{msg}
								</div>
							))}

							{!healthCheck.overall && (
								<div className="mt-2 pt-2 border-t border-gray-300">
									<div className="flex items-start text-orange-600">
										<AlertTriangle
											size={14}
											className="mr-1 mt-0.5 flex-shrink-0"
										/>
										<div>
											<div className="text-sm font-medium mb-1">
												系统未正常配置，请检查以下内容：
											</div>
											<div className="text-xs space-y-1">
												<div>• 检查 .env 文件和 Supabase 设置</div>
												<div>• 如果看到表缺失错误，需要运行数据库设置脚本</div>
												<div>
													• 查看{' '}
													<a
														href="/docs/database-quick-fix.md"
														target="_blank"
														className="underline hover:text-orange-700"
													>
														数据库快速修复指南
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			)}
			<div className="mb-4 p-3 bg-gray-50 rounded-lg">
				<div className="text-sm font-medium text-gray-700 mb-1">当前状态:</div>
				{loading ? (
					<div className="text-blue-600">加载中...</div>
				) : isAuthenticated ? (
					<div className="text-green-600">✓ 已登录 - {user?.email}</div>
				) : (
					<div className="text-gray-500">未登录</div>
				)}

				{error && (
					<div className="text-red-600 text-sm mt-1">错误: {error}</div>
				)}
			</div>

			{/* 测试账户输入 */}
			<div className="space-y-3 mb-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						测试邮箱
					</label>
					<div className="relative">
						<Mail
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							size={16}
						/>
						<input
							type="email"
							value={testEmail}
							onChange={(e) => setTestEmail(e.target.value)}
							className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
							placeholder="输入测试邮箱"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						密码
					</label>
					<div className="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							value={testPassword}
							onChange={(e) => setTestPassword(e.target.value)}
							className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
							placeholder="输入密码"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
						</button>
					</div>
				</div>
			</div>

			{/* 操作按钮 */}
			<div className="grid grid-cols-2 gap-2 mb-4">
				<Button
					onClick={handleQuickSignUp}
					disabled={isRunning || !testEmail || !testPassword}
					variant="outline"
					size="sm"
					className="text-sm"
				>
					{isRunning ? '处理中...' : '注册'}
				</Button>

				<Button
					onClick={handleQuickSignIn}
					disabled={isRunning || !testEmail || !testPassword}
					size="sm"
					className="bg-yellow-500 hover:bg-yellow-600 text-sm"
				>
					{isRunning ? '处理中...' : '登录'}
				</Button>
			</div>

			{isAuthenticated && (
				<Button
					onClick={handleSignOut}
					disabled={isRunning}
					variant="outline"
					size="sm"
					className="w-full text-red-600 border-red-300 hover:bg-red-50 text-sm"
				>
					{isRunning ? '处理中...' : '登出'}
				</Button>
			)}

			{/* 消息显示 */}
			{message && (
				<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
					<p className="text-blue-700 text-sm">{message}</p>
				</div>
			)}

			{/* 快捷链接 */}
			<div className="mt-4 pt-4 border-t border-gray-200">
				<div className="flex justify-between text-xs text-gray-500">
					<a href="/auth-test" className="hover:text-yellow-600 underline">
						高级测试页面
					</a>
					<a
						href="https://app.supabase.com"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-yellow-600 underline"
					>
						Supabase 控制台
					</a>
				</div>
			</div>
		</div>
	)
}

export default QuickLoginTest
