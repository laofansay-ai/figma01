import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
	User,
	Settings,
	ShoppingBag,
	Heart,
	CreditCard,
	MapPin,
	Bell,
	HelpCircle,
	LogOut,
	ChevronRight,
	Edit
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useUserStats } from '../hooks/useUserStats'
import LoginForm from '../components/auth/LoginForm'
import SignUpForm from '../components/auth/SignUpForm'
import QuickLoginTest from '../components/auth/QuickLoginTest'
import { Button } from '@/components/ui/button'

const Account = () => {
	const { user, loading, signOut, isAuthenticated } = useAuth()
	const { ordersCount, wishlistCount, totalSpent, loading: statsLoading } = useUserStats()
	const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'

	const menuItems = [
		{
			icon: ShoppingBag,
			title: 'My Orders',
			subtitle: 'Track your orders',
			path: '/orders',
			badge: ordersCount > 0 ? ordersCount.toString() : null
		},
		{
			icon: Heart,
			title: 'Wishlist',
			subtitle: 'Your favorite items',
			path: '/wishlist',
			badge: wishlistCount > 0 ? wishlistCount.toString() : null
		},
		{
			icon: CreditCard,
			title: 'Payment Methods',
			subtitle: 'Manage your cards',
			path: '/payment-methods'
		},
		{
			icon: MapPin,
			title: 'Addresses',
			subtitle: 'Delivery addresses',
			path: '/addresses'
		},
		{
			icon: Bell,
			title: 'Notifications',
			subtitle: 'Manage notifications',
			path: '/notifications'
		},
		{
			icon: Settings,
			title: 'Settings',
			subtitle: 'App preferences',
			path: '/settings'
		},
		{
			icon: HelpCircle,
			title: 'Help & Support',
			subtitle: 'Get help',
			path: '/help'
		}
	]

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		)
	}

	if (!isAuthenticated) {
		return (
			<div className="pb-20 bg-white min-h-screen">
				{/* Header */}
				<header className="px-4 pt-12 pb-6">
					<h1 className="text-2xl font-bold text-gray-900">Account</h1>
				</header>

				<div className="px-4">
					{authMode === 'login' ? (
						<LoginForm
							onSuccess={() => {
								// User will be automatically updated via auth state change
							}}
							onSwitchToSignUp={() => setAuthMode('signup')}
						/>
					) : (
						<SignUpForm
							onSuccess={() => {
								// User will be automatically updated via auth state change
							}}
							onSwitchToLogin={() => setAuthMode('login')}
						/>
					)}

					<div className="mt-8 text-center">
						<Link to="/" className="text-yellow-500 font-medium">
							Continue as Guest
						</Link>
					</div>

					{/* Quick Login Test */}
					<div className="mt-8">
						<QuickLoginTest />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="pb-20 bg-gray-50 min-h-screen">
			{/* Header */}
			<header className="bg-white px-4 pt-12 pb-6">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Account</h1>
					<button className="p-2 rounded-full hover:bg-gray-100">
						<Edit size={20} className="text-gray-600" />
					</button>
				</div>

				{/* User Info */}
				<div className="flex items-center space-x-4">
					<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
						<User size={24} className="text-yellow-600" />
					</div>
					<div className="flex-1">
						<h2 className="text-xl font-bold text-gray-900">
							{user?.user_metadata?.full_name ||
								user?.email?.split('@')[0] ||
								'User'}
						</h2>
						<p className="text-gray-600">{user?.email}</p>
						<p className="text-sm text-gray-500">
							Member since {new Date(user?.created_at).getFullYear()}
						</p>
					</div>
				</div>
			</header>

			{/* Stats */}
			<section className="px-4 mb-6">
				<div className="grid grid-cols-3 gap-4">
					<div className="bg-white rounded-2xl p-4 text-center">
						<div className="text-2xl font-bold text-yellow-500 mb-1">
							{statsLoading ? '...' : ordersCount}
						</div>
						<div className="text-sm text-gray-600">Orders</div>
					</div>
					<div className="bg-white rounded-2xl p-4 text-center">
						<div className="text-2xl font-bold text-yellow-500 mb-1">
							{statsLoading ? '...' : wishlistCount}
						</div>
						<div className="text-sm text-gray-600">Wishlist</div>
					</div>
					<div className="bg-white rounded-2xl p-4 text-center">
						<div className="text-2xl font-bold text-yellow-500 mb-1">
							{statsLoading ? '...' : `$${Math.round(totalSpent)}`}
						</div>
						<div className="text-sm text-gray-600">Spent</div>
					</div>
				</div>
			</section>

			{/* Menu Items */}
			<section className="px-4 mb-6">
				<div className="bg-white rounded-3xl overflow-hidden shadow-sm">
					{menuItems.map((item, index) => (
						<Link
							key={index}
							to={item.path}
							className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
						>
							<div className="flex items-center space-x-4">
								<div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
									<item.icon size={20} className="text-gray-600" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900">{item.title}</h3>
									<p className="text-sm text-gray-500">{item.subtitle}</p>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								{item.badge && (
									<span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
										{item.badge}
									</span>
								)}
								<ChevronRight size={16} className="text-gray-400" />
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* Logout */}
			<section className="px-4">
				<button
					onClick={signOut}
					className="w-full bg-white rounded-2xl p-4 flex items-center justify-center space-x-3 text-red-500 hover:bg-red-50 transition-colors"
				>
					<LogOut size={20} />
					<span className="font-semibold">Sign Out</span>
				</button>
			</section>

			{/* App Info */}
			<section className="px-4 mt-8 text-center">
				<p className="text-gray-500 text-sm">Ulmo E-Commerce v1.0.0</p>
			</section>
		</div>
	)
}

export default Account
