import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Filter, TrendingUp, Clock } from 'lucide-react'
import { productService } from '../../services/productService'

const SearchBar = ({
	placeholder = 'Search furniture, decor...',
	className = ''
}) => {
	const [query, setQuery] = useState('')
	const [suggestions, setSuggestions] = useState([])
	const [recentSearches, setRecentSearches] = useState([])
	const [isOpen, setIsOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const searchRef = useRef(null)
	const debounceRef = useRef(null)
	const navigate = useNavigate()

	// Load recent searches from localStorage
	useEffect(() => {
		const stored = localStorage.getItem('recentSearches')
		if (stored) {
			try {
				setRecentSearches(JSON.parse(stored))
			} catch (error) {
				console.error('Error loading recent searches:', error)
			}
		}
	}, [])

	// Debounced search suggestions
	useEffect(() => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current)
		}

		if (query.trim().length > 1) {
			debounceRef.current = setTimeout(async () => {
				setLoading(true)
				try {
					const { data } = await productService.searchSuggestions(query)
					setSuggestions(data || [])
				} catch (error) {
					console.error('Error fetching suggestions:', error)
					setSuggestions([])
				} finally {
					setLoading(false)
				}
			}, 300)
		} else {
			setSuggestions([])
		}

		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current)
			}
		}
	}, [query])

	// Handle click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const saveRecentSearch = (searchQuery) => {
		const updated = [
			searchQuery,
			...recentSearches.filter((s) => s !== searchQuery)
		].slice(0, 5)
		setRecentSearches(updated)
		localStorage.setItem('recentSearches', JSON.stringify(updated))
	}

	const handleSearch = (searchQuery = query) => {
		if (searchQuery.trim()) {
			saveRecentSearch(searchQuery.trim())
			navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
			setIsOpen(false)
			setQuery('')
		}
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleSearch()
		} else if (e.key === 'Escape') {
			setIsOpen(false)
		}
	}

	const clearRecentSearches = () => {
		setRecentSearches([])
		localStorage.removeItem('recentSearches')
	}

	const removeRecentSearch = (searchToRemove) => {
		const updated = recentSearches.filter((s) => s !== searchToRemove)
		setRecentSearches(updated)
		localStorage.setItem('recentSearches', JSON.stringify(updated))
	}

	return (
		<div ref={searchRef} className={`relative ${className}`}>
			{/* Search Input */}
			<div className="relative">
				<Search
					className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
					size={20}
				/>
				<input
					type="text"
					placeholder={placeholder}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setIsOpen(true)}
					onKeyPress={handleKeyPress}
					className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
				/>
				{query && (
					<button
						onClick={() => setQuery('')}
						className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
					>
						<X size={20} />
					</button>
				)}
			</div>

			{/* Search Dropdown */}
			{isOpen && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 max-h-96 overflow-y-auto z-50">
					{/* Loading State */}
					{loading && (
						<div className="flex items-center justify-center py-4">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
							<span className="ml-2 text-gray-600">Searching...</span>
						</div>
					)}

					{/* Search Suggestions */}
					{!loading && suggestions.length > 0 && (
						<div className="p-4">
							<div className="flex items-center mb-3">
								<TrendingUp size={16} className="text-gray-500 mr-2" />
								<span className="text-sm font-medium text-gray-700">
									Suggestions
								</span>
							</div>
							{suggestions.map((suggestion, index) => (
								<button
									key={index}
									onClick={() => handleSearch(suggestion)}
									className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
								>
									<div className="flex items-center">
										<Search size={14} className="text-gray-400 mr-3" />
										<span className="text-gray-700">{suggestion}</span>
									</div>
								</button>
							))}
						</div>
					)}

					{/* Recent Searches */}
					{!loading &&
						suggestions.length === 0 &&
						recentSearches.length > 0 && (
							<div className="p-4">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center">
										<Clock size={16} className="text-gray-500 mr-2" />
										<span className="text-sm font-medium text-gray-700">
											Recent searches
										</span>
									</div>
									<button
										onClick={clearRecentSearches}
										className="text-xs text-gray-500 hover:text-gray-700"
									>
										Clear all
									</button>
								</div>
								{recentSearches.map((recent, index) => (
									<div key={index} className="flex items-center group">
										<button
											onClick={() => handleSearch(recent)}
											className="flex-1 text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
										>
											<div className="flex items-center">
												<Clock size={14} className="text-gray-400 mr-3" />
												<span className="text-gray-700">{recent}</span>
											</div>
										</button>
										<button
											onClick={() => removeRecentSearch(recent)}
											className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
										>
											<X size={14} className="text-gray-400" />
										</button>
									</div>
								))}
							</div>
						)}

					{/* Popular Categories */}
					{!loading && suggestions.length === 0 && query.length === 0 && (
						<div className="p-4">
							<div className="flex items-center mb-3">
								<Filter size={16} className="text-gray-500 mr-2" />
								<span className="text-sm font-medium text-gray-700">
									Popular categories
								</span>
							</div>
							<div className="grid grid-cols-2 gap-2">
								{[
									{ name: 'Furniture', emoji: '🪑' },
									{ name: 'Lighting', emoji: '💡' },
									{ name: 'Decor', emoji: '🏺' },
									{ name: 'Textiles', emoji: '🛏️' }
								].map((category, index) => (
									<button
										key={index}
										onClick={() =>
											navigate(`/categories/${category.name.toLowerCase()}`)
										}
										className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
									>
										<span className="text-lg mr-2">{category.emoji}</span>
										<span className="text-sm text-gray-700">
											{category.name}
										</span>
									</button>
								))}
							</div>
						</div>
					)}

					{/* No Results */}
					{!loading && suggestions.length === 0 && query.length > 1 && (
						<div className="p-4 text-center">
							<p className="text-gray-500">
								No suggestions found for "{query}"
							</p>
							<button
								onClick={() => handleSearch()}
								className="mt-2 text-yellow-500 hover:text-yellow-600 font-medium"
							>
								Search anyway
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default SearchBar
