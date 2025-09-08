import { Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'Living Room',
      count: 45,
      image: '/api/placeholder/400/200',
      subcategories: ['Sofas', 'Coffee Tables', 'TV Stands', 'Armchairs']
    },
    {
      id: 2,
      name: 'Bedroom',
      count: 38,
      image: '/api/placeholder/400/200',
      subcategories: ['Beds', 'Wardrobes', 'Nightstands', 'Dressers']
    },
    {
      id: 3,
      name: 'Dining Room',
      count: 29,
      image: '/api/placeholder/400/200',
      subcategories: ['Dining Tables', 'Chairs', 'Cabinets', 'Bar Stools']
    },
    {
      id: 4,
      name: 'Office',
      count: 22,
      image: '/api/placeholder/400/200',
      subcategories: ['Desks', 'Office Chairs', 'Bookcases', 'Storage']
    },
    {
      id: 5,
      name: 'Kitchen',
      count: 31,
      image: '/api/placeholder/400/200',
      subcategories: ['Bar Stools', 'Kitchen Islands', 'Cabinets', 'Carts']
    },
    {
      id: 6,
      name: 'Outdoor',
      count: 18,
      image: '/api/placeholder/400/200',
      subcategories: ['Patio Sets', 'Loungers', 'Umbrellas', 'Planters']
    },
    {
      id: 7,
      name: 'Lighting',
      count: 42,
      image: '/api/placeholder/400/200',
      subcategories: ['Table Lamps', 'Floor Lamps', 'Ceiling Lights', 'Wall Lights']
    },
    {
      id: 8,
      name: 'Decor',
      count: 67,
      image: '/api/placeholder/400/200',
      subcategories: ['Vases', 'Mirrors', 'Artwork', 'Cushions']
    }
  ]

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Categories</h1>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Search size={24} className="text-gray-700" />
          </button>
        </div>
      </header>

      {/* Categories Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`}
              className="group"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                {/* Category Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                    <p className="text-white/80">{category.count} items</p>
                  </div>
                </div>

                {/* Subcategories */}
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.map((sub, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Categories */}
      <section className="px-4 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Popular This Week</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.slice(0, 4).map((category) => (
            <Link
              key={`popular-${category.id}`}
              to={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`}
              className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-4 text-white hover:shadow-lg transition-shadow"
            >
              <h4 className="font-bold text-lg mb-1">{category.name}</h4>
              <p className="text-yellow-100 text-sm">{category.count} items</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Categories

