import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { UserProvider } from './context/UserContext'
import Home from './pages/Home'
import Categories from './pages/Categories'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import Account from './pages/Account'
import AuthTestPage from './components/auth/AuthTestPage'
import CartTestPage from './pages/CartTestPage'
import CartImageTestPage from './pages/CartImageTestPage'
import Navigation from './components/common/Navigation'
import './App.css'

function App() {
	return (
		<Router>
			<UserProvider>
				<CartProvider>
					<div className="min-h-screen bg-white">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/categories" element={<Categories />} />
							<Route path="/categories/:category" element={<ProductList />} />
							<Route path="/products" element={<ProductList />} />
							<Route path="/products/:id" element={<ProductDetail />} />
							<Route path="/cart" element={<Cart />} />
							<Route path="/checkout" element={<Checkout />} />
							<Route path="/orders" element={<Orders />} />
							<Route path="/wishlist" element={<Wishlist />} />
							<Route path="/account" element={<Account />} />
							<Route path="/auth-test" element={<AuthTestPage />} />
							<Route path="/cart-test" element={<CartTestPage />} />
							<Route path="/cart-image-test" element={<CartImageTestPage />} />
						</Routes>
						<Navigation />
					</div>
				</CartProvider>
			</UserProvider>
		</Router>
	)
}

export default App


