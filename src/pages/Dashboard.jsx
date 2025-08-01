import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await ordersAPI.getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Information */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-300">Name</label>
                  <p className="text-white">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <p className="text-white">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Member Since</label>
                  <p className="text-white">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mt-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Orders</span>
                  <span className="font-semibold text-white">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Spent</span>
                  <span className="font-semibold text-white">
                    ${orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

                     {/* Order History */}
           <div className="lg:col-span-2">
             <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
               <h2 className="text-xl font-semibold text-white mb-6">Order History</h2>
               
               {loading ? (
                 <div className="text-center py-8">
                   <div className="text-gray-300">Loading orders...</div>
                 </div>
               ) : orders.length === 0 ? (
                 <div className="text-center py-8">
                   <div className="text-gray-300 mb-4">No orders found</div>
                   <p className="text-sm text-gray-400">
                     Start shopping to see your order history here.
                   </p>
                 </div>
               ) : (
                 <div className="space-y-6">
                   {orders.map((order) => (
                     <div key={order._id} className="border border-white/10 rounded-xl p-4 bg-white/5 backdrop-blur-sm">
                       <div className="flex justify-between items-start mb-4">
                         <div>
                           <h3 className="font-semibold text-white">
                             Order #{order._id.slice(-8)}
                           </h3>
                           <p className="text-sm text-gray-300">
                             {formatDate(order.createdAt)}
                           </p>
                         </div>
                         <div className="text-right">
                           <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                             {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                           </span>
                           <p className="text-lg font-semibold text-white mt-1">
                             ${order.totalAmount.toFixed(2)}
                           </p>
                         </div>
                       </div>
                       
                       <div className="space-y-2">
                         {order.products.map((item, index) => (
                           <div key={index} className="flex justify-between items-center text-sm">
                             <span className="text-gray-300">
                               {item.productId?.name || 'Product'} (Qty: {item.quantity})
                             </span>
                             <span className="text-white">${item.price.toFixed(2)}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 