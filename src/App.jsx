import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ULMO</h1>
        <p className="text-xl text-gray-600 mb-8">Modern E-Commerce Platform</p>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Ulmo</h2>
          <p className="text-gray-600 mb-6">Your modern furniture and decor destination</p>
          <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

