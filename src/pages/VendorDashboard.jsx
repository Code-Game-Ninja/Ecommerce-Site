import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productsAPI, vendorOrdersAPI } from '../utils/api';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  RefreshCw
} from 'lucide-react';

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    sizes: '',
    colors: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        productsAPI.getAll(),
        vendorOrdersAPI.getAllOrders()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      sizes: formData.sizes.split(',').map(size => size.trim()).filter(size => size),
      colors: formData.colors.split(',').map(color => color.trim()).filter(color => color)
    };

    try {
      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct._id, productData);
      } else {
        await productsAPI.createProduct(productData);
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(productId);
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: '',
      sizes: '',
      colors: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await vendorOrdersAPI.updateOrderStatus(orderId, newStatus);
      // Refresh orders data
      const updatedOrders = await vendorOrdersAPI.getAllOrders();
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status. Please try again.');
    }
  };

  // Calculate dashboard metrics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockProducts = products.filter(p => p.stock <= 10 && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'processing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'shipped': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'delivered': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <BarChart3 className="w-4 h-4" />;
      case 'shipped': return <Package className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Vendor Dashboard</h1>
            <p className="text-gray-300">Manage your products and track your business</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingCart }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Products</p>
                    <p className="text-2xl font-bold text-white">{totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{totalOrders}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending Orders</p>
                    <p className="text-2xl font-bold text-white">{pendingOrders}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lowStockProducts > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                    <div>
                      <h3 className="text-white font-semibold">Low Stock Alert</h3>
                      <p className="text-yellow-300">{lowStockProducts} products are running low on stock</p>
                    </div>
                  </div>
                </div>
              )}

              {outOfStockProducts > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <div>
                      <h3 className="text-white font-semibold">Out of Stock</h3>
                      <p className="text-red-300">{outOfStockProducts} products are out of stock</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <p className="text-white font-medium">Order #{order._id.slice(-6)}</p>
                        <p className="text-gray-400 text-sm">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Product Management</h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product Form */}
              {showForm && (
                <div className="lg:col-span-1">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sticky top-8 shadow-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          rows="3"
                          className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Stock
                          </label>
                          <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white backdrop-blur-sm"
                        >
                          <option value="">Select Category</option>
                          <option value="T-Shirts">T-Shirts</option>
                          <option value="Jeans">Jeans</option>
                          <option value="Hoodies">Hoodies</option>
                          <option value="Shirts">Shirts</option>
                          <option value="Dresses">Dresses</option>
                          <option value="Shoes">Shoes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          name="image"
                          value={formData.image}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Sizes
                          </label>
                          <input
                            type="text"
                            name="sizes"
                            value={formData.sizes}
                            onChange={handleChange}
                            placeholder="S, M, L, XL"
                            className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Colors
                          </label>
                          <input
                            type="text"
                            name="colors"
                            value={formData.colors}
                            onChange={handleChange}
                            placeholder="Red, Blue, Green"
                            className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="flex-1 bg-white/10 backdrop-blur-sm text-white py-3 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Products List */}
              <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-6">Your Products ({totalProducts})</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((product) => (
                      <div key={product._id} className="border border-white/10 rounded-xl p-4 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{product.name}</h4>
                            <p className="text-sm text-gray-300 mb-2 line-clamp-2">{product.description}</p>
                            <p className="text-lg font-bold text-blue-400">${product.price}</p>
                            <p className="text-sm text-gray-400">{product.category}</p>
                            <p className={`text-sm ${product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                              Stock: {product.stock}
                            </p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-6">Order Management</h2>
              
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Order #{order._id.slice(-8)}</h3>
                          <p className="text-gray-400 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-400">${order.total.toFixed(2)}</p>
                        <p className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </p>
                      </div>
                    </div>

                    {/* Products in Order */}
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-3">Products</h4>
                      <div className="space-y-2">
                        {order.products?.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                            <img
                              src={item.product?.image || '/placeholder.jpg'}
                              alt={item.product?.name || 'Product'}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="text-white font-medium">{item.product?.name || 'Product'}</p>
                              <p className="text-gray-400 text-sm">Qty: {item.quantity} × ${item.price}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-medium mb-2">Customer Information</h4>
                        <div className="text-gray-300 text-sm space-y-1">
                          <p><strong>Name:</strong> {order.shippingInfo?.fullName}</p>
                          <p><strong>Email:</strong> {order.shippingInfo?.email}</p>
                          <p><strong>Phone:</strong> {order.shippingInfo?.phone}</p>
                          <p><strong>Address:</strong></p>
                          <p className="ml-2">{order.shippingInfo?.address}</p>
                          <p className="ml-2">{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2">Order Details</h4>
                        <div className="text-gray-300 text-sm space-y-1">
                          <p><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase()}</p>
                          <p><strong>Items:</strong> {order.products?.length || 0}</p>
                          <p><strong>Status:</strong> {order.status}</p>
                        </div>
                        
                        {/* Status Update */}
                        <div className="mt-4">
                          <h5 className="text-white font-medium mb-2">Update Status</h5>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard; 