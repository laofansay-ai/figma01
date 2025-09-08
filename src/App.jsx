import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { UserProvider } from './context/UserContext'
import Navigation from './components/common/Navigation'
import Home from './pages/Home'
import Categories from './pages/Categories'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Account from './pages/Account'
import './App.css'

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/account" element={<Account />} />
            </Routes>
            <Navigation />
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  )
}

export default App

