import { useState, useEffect } from 'react'
import { X, Filter, ChevronDown, Check } from 'lucide-react'
import { Button } from '../ui/button'

const ProductFilters = ({
	isOpen,
	onClose,
	filters = {},
	onFiltersChange,
	categories = [],
	priceRange = { min: 0, max: 1000 }
}) => {
	const [localFilters, setLocalFilters] = useState({
		categories: [],
		priceMin: priceRange.min,
		priceMax: priceRange.max,
		rating: 0,
		inStock: false,
		onSale: false,
		...filters
	})

	const [expandedSections, setExpandedSections] = useState({
		category: true,
		price: true,
		rating: true,
		availability: true
	})

	useEffect(() => {
		setLocalFilters((prev) => ({ ...prev, ...filters }))
	}, [filters])

	const toggleSection = (section) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section]
		}))
	}

	const handleCategoryToggle = (categorySlug) => {
		setLocalFilters((prev) => ({
			...prev,
			categories: prev.categories.includes(categorySlug)
				? prev.categories.filter((c) => c !== categorySlug)
				: [...prev.categories, categorySlug]
		}))
	}

	const handlePriceChange = (field, value) => {
		setLocalFilters((prev) => ({
			...prev,
			[field]: parseInt(value) || 0
		}))
	}

	const handleRatingChange = (rating) => {
		setLocalFilters((prev) => ({
			...prev,
			rating: prev.rating === rating ? 0 : rating
		}))
	}

	const handleToggleFilter = (field) => {
		setLocalFilters((prev) => ({
			...prev,
			[field]: !prev[field]
		}))
	}

	const applyFilters = () => {
		onFiltersChange(localFilters)
		onClose()
	}

	const clearFilters = () => {
		const cleared = {
			categories: [],
			priceMin: priceRange.min,
			priceMax: priceRange.max,
			rating: 0,
			inStock: false,
			onSale: false
		}
		setLocalFilters(cleared)
		onFiltersChange(cleared)
	}

	const hasActiveFilters = () => {
		return (
			localFilters.categories.length > 0 ||
			localFilters.priceMin > priceRange.min ||
			localFilters.priceMax < priceRange.max ||
			localFilters.rating > 0 ||
			localFilters.inStock ||
			localFilters.onSale
		)
	}

	const renderStars = (rating) => {
		return Array.from({ length: 5 }, (_, i) => (
			<span
				key={i}
				className={`text-lg ${
					i < rating ? 'text-yellow-400' : 'text-gray-300'
				}`}
			>
				★
			</span>
		))
	}

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={onClose}
				/>
			)}

			{/* Filter Panel */}
			<div
				className={`
        fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<div className="flex items-center">
						<Filter size={24} className="text-gray-700 mr-3" />
						<h2 className="text-xl font-bold text-gray-900">Filters</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} className="text-gray-600" />
					</button>
				</div>

				{/* Filter Content */}
				<div className="flex flex-col h-full">
					<div className="flex-1 overflow-y-auto p-6 space-y-6">
						{/* Categories */}
						<div>
							<button
								onClick={() => toggleSection('category')}
								className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
							>
								Categories
								<ChevronDown
									size={16}
									className={`transform transition-transform ${
										expandedSections.category ? 'rotate-180' : ''
									}`}
								/>
							</button>

							{expandedSections.category && (
								<div className="space-y-2">
									{categories.map((category) => (
										<label
											key={category.slug}
											className="flex items-center cursor-pointer"
										>
											<div className="relative">
												<input
													type="checkbox"
													checked={localFilters.categories.includes(
														category.slug
													)}
													onChange={() => handleCategoryToggle(category.slug)}
													className="sr-only"
												/>
												<div
													className={`
                          w-5 h-5 border-2 rounded flex items-center justify-center
                          ${
														localFilters.categories.includes(category.slug)
															? 'bg-yellow-500 border-yellow-500'
															: 'border-gray-300'
													}
                        `}
												>
													{localFilters.categories.includes(category.slug) && (
														<Check size={12} className="text-white" />
													)}
												</div>
											</div>
											<span className="ml-3 text-gray-700 flex items-center">
												<span className="mr-2">{category.icon}</span>
												{category.name}
												{category.productCount && (
													<span className="text-sm text-gray-500 ml-1">
														({category.productCount})
													</span>
												)}
											</span>
										</label>
									))}
								</div>
							)}
						</div>

						{/* Price Range */}
						<div>
							<button
								onClick={() => toggleSection('price')}
								className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
							>
								Price Range
								<ChevronDown
									size={16}
									className={`transform transition-transform ${
										expandedSections.price ? 'rotate-180' : ''
									}`}
								/>
							</button>

							{expandedSections.price && (
								<div className="space-y-4">
									<div className="flex items-center space-x-3">
										<div>
											<label className="block text-sm text-gray-600 mb-1">
												Min
											</label>
											<input
												type="number"
												value={localFilters.priceMin}
												onChange={(e) =>
													handlePriceChange('priceMin', e.target.value)
												}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
												placeholder="0"
											/>
										</div>
										<div className="text-gray-400 mt-6">-</div>
										<div>
											<label className="block text-sm text-gray-600 mb-1">
												Max
											</label>
											<input
												type="number"
												value={localFilters.priceMax}
												onChange={(e) =>
													handlePriceChange('priceMax', e.target.value)
												}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
												placeholder="1000"
											/>
										</div>
									</div>

									{/* Price Range Slider */}
									<div className="px-2">
										<input
											type="range"
											min={priceRange.min}
											max={priceRange.max}
											value={localFilters.priceMax}
											onChange={(e) =>
												handlePriceChange('priceMax', e.target.value)
											}
											className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
										/>
										<div className="flex justify-between text-sm text-gray-500 mt-1">
											<span>${priceRange.min}</span>
											<span>${priceRange.max}</span>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Rating */}
						<div>
							<button
								onClick={() => toggleSection('rating')}
								className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
							>
								Customer Rating
								<ChevronDown
									size={16}
									className={`transform transition-transform ${
										expandedSections.rating ? 'rotate-180' : ''
									}`}
								/>
							</button>

							{expandedSections.rating && (
								<div className="space-y-2">
									{[5, 4, 3, 2, 1].map((rating) => (
										<label
											key={rating}
											className="flex items-center cursor-pointer"
										>
											<div className="relative">
												<input
													type="radio"
													name="rating"
													checked={localFilters.rating === rating}
													onChange={() => handleRatingChange(rating)}
													className="sr-only"
												/>
												<div
													className={`
                          w-5 h-5 border-2 rounded-full flex items-center justify-center
                          ${
														localFilters.rating === rating
															? 'bg-yellow-500 border-yellow-500'
															: 'border-gray-300'
													}
                        `}
												>
													{localFilters.rating === rating && (
														<div className="w-2 h-2 bg-white rounded-full" />
													)}
												</div>
											</div>
											<span className="ml-3 flex items-center">
												{renderStars(rating)}
												<span className="text-gray-600 ml-2">& up</span>
											</span>
										</label>
									))}
								</div>
							)}
						</div>

						{/* Availability */}
						<div>
							<button
								onClick={() => toggleSection('availability')}
								className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
							>
								Availability
								<ChevronDown
									size={16}
									className={`transform transition-transform ${
										expandedSections.availability ? 'rotate-180' : ''
									}`}
								/>
							</button>

							{expandedSections.availability && (
								<div className="space-y-2">
									<label className="flex items-center cursor-pointer">
										<div className="relative">
											<input
												type="checkbox"
												checked={localFilters.inStock}
												onChange={() => handleToggleFilter('inStock')}
												className="sr-only"
											/>
											<div
												className={`
                        w-5 h-5 border-2 rounded flex items-center justify-center
                        ${
													localFilters.inStock
														? 'bg-yellow-500 border-yellow-500'
														: 'border-gray-300'
												}
                      `}
											>
												{localFilters.inStock && (
													<Check size={12} className="text-white" />
												)}
											</div>
										</div>
										<span className="ml-3 text-gray-700">In Stock</span>
									</label>

									<label className="flex items-center cursor-pointer">
										<div className="relative">
											<input
												type="checkbox"
												checked={localFilters.onSale}
												onChange={() => handleToggleFilter('onSale')}
												className="sr-only"
											/>
											<div
												className={`
                        w-5 h-5 border-2 rounded flex items-center justify-center
                        ${
													localFilters.onSale
														? 'bg-yellow-500 border-yellow-500'
														: 'border-gray-300'
												}
                      `}
											>
												{localFilters.onSale && (
													<Check size={12} className="text-white" />
												)}
											</div>
										</div>
										<span className="ml-3 text-gray-700">On Sale</span>
									</label>
								</div>
							)}
						</div>
					</div>

					{/* Footer Actions */}
					<div className="border-t border-gray-200 p-6 space-y-3">
						{hasActiveFilters() && (
							<Button
								variant="outline"
								onClick={clearFilters}
								className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
							>
								Clear All Filters
							</Button>
						)}

						<Button
							onClick={applyFilters}
							className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
						>
							Apply Filters
						</Button>
					</div>
				</div>
			</div>

			<style jsx>{`
				.slider::-webkit-slider-thumb {
					appearance: none;
					height: 20px;
					width: 20px;
					border-radius: 50%;
					background: #eab308;
					cursor: pointer;
					border: 2px solid #fff;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
				}

				.slider::-moz-range-thumb {
					height: 20px;
					width: 20px;
					border-radius: 50%;
					background: #eab308;
					cursor: pointer;
					border: 2px solid #fff;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
				}
			`}</style>
		</>
	)
}

export default ProductFilters
