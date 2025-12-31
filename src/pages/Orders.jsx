import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Clock, DollarSign, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

​    if (!isAuthenticated) {
​      setLoading(false)
​      return
​    }
​    

    loadOrders()
  }, [isAuthenticated, user])

  const loadOrders = async () => {
    setLoading(true)
    try {
      console.log('Loading orders for user:', user?.id)
      const { data, error } = await orderService.getUserOrders(user?.id)
      console.log('Orders loaded:', data, 'Error:', error)
      if (error) {
        console.error('Error loading orders:', error)
      } else {
        setOrders(data || [])
=======
    const fetchOrders = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoading(false);
        setError('Please log in to view your orders.');
        return;
>>>>>>> 
      }

      setLoading(true);
      setError(null);
      const { data, error } = await orderService.getOrdersByUserId(user.id);
      if (error) {
        setError(error.message || 'Failed to fetch orders.');
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };
    
    fetchOrders();
  }, [isAuthenticated, user?.id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">Error: {error}</p>
        {!isAuthenticated && (
          <Link to="/account" className="bg-yellow-500 text-white px-6 py-3 rounded-xl hover:bg-yellow-600 transition-colors">
            Log In
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="px-4 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link to="/account" className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          <div className="w-8"></div> {/* Placeholder for alignment */}
        </div>
      </header>

      <main className="p-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Package size={64} className="text-gray-300 mb-4" />
            <p className="text-lg text-gray-600">You haven't placed any orders yet.</p>
            <Link to="/" className="mt-4 bg-yellow-500 text-white px-6 py-3 rounded-xl hover:bg-yellow-600 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-gray-50 rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-gray-900">Order #{order.order_number || order.id.substring(0, 8)}</h2>
                  <span className={`text-sm font-medium ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>


                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.order_items?.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.product_image || item.products?.images?.[0] || '/api/placeholder/48/48'}
                          alt={item.product_name || item.products?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product_name || item.products?.name || 'Product'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} • {formatPrice(item.unit_price || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.order_items?.length > 2 && (
                    <p className="text-xs text-gray-500 pl-15">
                      +{order.order_items.length - 2} more items
                    </p>
                  )}
                </div>
    
                {/* Order Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Total: {formatPrice(order.total_amount || order.summary?.total || 0)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-3 py-1 border-gray-300 text-gray-700"
                    >
                      View Details
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-3 py-1 border-red-300 text-red-600"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center"><Clock size={16} className="mr-2" />Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="flex items-center"><DollarSign size={16} className="mr-2" />Total: {formatPrice(order.total_amount)}</p>
                  <p className="flex items-center"><MapPin size={16} className="mr-2" />Shipping to: {order.shipping_address?.city}, {order.shipping_address?.state}</p>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Items:</h3>
                  <ul className="space-y-2">
                    {order.order_items?.map(item => (
                      <li key={item.id} className="flex items-center text-sm text-gray-700">
                        <img
                          src={item.products?.images?.[0] || '/api/placeholder/50/50'}
                          alt={item.products?.name || 'Product'}
                          className="w-10 h-10 object-cover rounded-md mr-3"
                        />
                        <span>{item.products?.name || 'Unknown Product'} x {item.quantity}</span>
                      </li>
                    ))}
                  </ul>

>>>>>>> 
                </div>
                <Link to={`/order/${order.id}`} className="mt-4 inline-block text-yellow-500 hover:underline text-sm">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;

