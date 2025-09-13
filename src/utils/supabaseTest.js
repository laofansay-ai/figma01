import { supabase } from '../lib/supabase'

/**
 * 测试 Supabase 连接状态
 */
export const testSupabaseConnection = async () => {
	try {
		// 首先尝试连接到认证系统（这总是可用的）
		const {
			data: { user },
			error: authError
		} = await supabase.auth.getUser()

		if (authError && authError.status !== 400) {
			return {
				success: false,
				message: `Supabase 连接失败: ${authError.message}`,
				error: authError
			}
		}

		// 尝试查询一个常见的系统表
		try {
			const { data, error } = await supabase
				.from('site_settings')
				.select('key')
				.limit(1)

			if (error) {
				// 如果 site_settings 表不存在，提供设置指导
				if (
					error.code === 'PGRST116' ||
					error.message.includes('site_settings')
				) {
					return {
						success: false,
						message: '数据库表未设置，请运行数据库初始化脚本',
						error,
						needsSetup: true
					}
				}

				return {
					success: false,
					message: `数据库查询失败: ${error.message}`,
					error
				}
			}

			return {
				success: true,
				message: '数据库连接成功',
				data
			}
		} catch (queryError) {
			return {
				success: false,
				message: `数据库查询异常: ${queryError.message}`,
				error: queryError,
				needsSetup: true
			}
		}
	} catch (err) {
		return {
			success: false,
			message: `连接测试异常: ${err.message}`,
			error: err
		}
	}
}

/**
 * 验证环境变量配置
 */
export const validateEnvironment = () => {
	const errors = []
	const warnings = []

	// 检查必需的环境变量
	const requiredVars = {
		VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
		VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
	}

	Object.entries(requiredVars).forEach(([key, value]) => {
		if (!value) {
			errors.push(`缺少必需的环境变量: ${key}`)
		} else if (value.includes('your-') || value.includes('replace')) {
			warnings.push(`环境变量 ${key} 似乎未正确配置`)
		}
	})

	// 验证 URL 格式
	const supabaseUrl = requiredVars.VITE_SUPABASE_URL
	if (
		supabaseUrl &&
		(!supabaseUrl.startsWith('https://') ||
			!supabaseUrl.includes('.supabase.co'))
	) {
		errors.push('Supabase URL 格式不正确')
	}

	// 验证密钥格式
	const anonKey = requiredVars.VITE_SUPABASE_ANON_KEY
	if (anonKey && !anonKey.startsWith('eyJ')) {
		warnings.push('Supabase anon key 格式可能不正确')
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
		config: {
			url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '未设置',
			anonKey: anonKey ? `${anonKey.substring(0, 20)}...` : '未设置'
		}
	}
}

/**
 * 测试认证功能
 */
export const testAuthentication = async () => {
	try {
		// 测试获取当前用户（无需登录）
		const {
			data: { user }
		} = await supabase.auth.getUser()

		return {
			success: true,
			message: '认证服务可用',
			user: user
				? {
						id: user.id,
						email: user.email,
						created_at: user.created_at
				  }
				: null
		}
	} catch (err) {
		return {
			success: false,
			message: `认证测试失败: ${err.message}`,
			error: err
		}
	}
}

/**
 * 完整的系统健康检查
 */
export const performHealthCheck = async () => {
	const results = {
		timestamp: new Date().toISOString(),
		environment: validateEnvironment(),
		connection: null,
		authentication: null,
		overall: false
	}

	// 只有环境变量正确时才进行连接测试
	if (results.environment.isValid) {
		results.connection = await testSupabaseConnection()
		results.authentication = await testAuthentication()

		results.overall =
			results.connection.success && results.authentication.success
	}

	return results
}

/**
 * 格式化健康检查结果为用户友好的消息
 */
export const formatHealthCheckResults = (results) => {
	const messages = []

	// 环境变量检查
	if (results.environment.errors.length > 0) {
		messages.push(`❌ 环境配置错误: ${results.environment.errors.join(', ')}`)
	} else {
		messages.push('✅ 环境变量配置正确')
	}

	if (results.environment.warnings.length > 0) {
		messages.push(`⚠️ 配置警告: ${results.environment.warnings.join(', ')}`)
	}

	// 连接测试结果
	if (results.connection) {
		if (results.connection.success) {
			messages.push('✅ 数据库连接正常')
		} else {
			messages.push(`❌ ${results.connection.message}`)

			// 如果需要数据库设置，提供指导
			if (results.connection.needsSetup) {
				messages.push('📋 请按以下步骤设置数据库:')
				messages.push('   1. 打开 Supabase 控制台 (https://app.supabase.com)')
				messages.push('   2. 进入 SQL Editor 页面')
				messages.push('   3. 复制并执行 scripts/setup_database.sql 中的脚本')
				messages.push('   4. 或者使用命令: pnpm run setup:db')
			}
		}
	}

	// 认证测试结果
	if (results.authentication) {
		if (results.authentication.success) {
			messages.push('✅ 认证服务正常')
			if (results.authentication.user) {
				messages.push(`👤 当前用户: ${results.authentication.user.email}`)
			}
		} else {
			messages.push(`❌ ${results.authentication.message}`)
		}
	}

	return messages
}
