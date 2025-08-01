import { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';

const Vendor = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll(); // For now, get all products
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
      fetchProducts();
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
        sizes: product.sizes.join(', '),
        colors: product.colors.join(', ')
      });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(productId);
        fetchProducts();
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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Vendor Dashboard</h1>
            <p className="text-gray-300">Manage your products</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Add New Product
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Form */}
          {showForm && (
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sticky top-8 shadow-2xl">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                
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
                      className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
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
                      className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>

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
                      className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="Enter stock quantity"
                      className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                    />
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
                      className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800/50 text-white backdrop-blur-sm"
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
                      className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Sizes (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleChange}
                      placeholder="S, M, L, XL"
                      className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Colors (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="colors"
                      value={formData.colors}
                      onChange={handleChange}
                      placeholder="Red, Blue, Green"
                      className="w-full border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>

                                     <div className="flex space-x-3">
                     <button
                       type="submit"
                       className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                     >
                       {editingProduct ? 'Update Product' : 'Add Product'}
                     </button>
                     <button
                       type="button"
                       onClick={resetForm}
                       className="flex-1 bg-white/10 backdrop-blur-sm text-white py-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
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
              <h2 className="text-xl font-semibold text-white mb-6">Your Products</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-300">Loading products...</div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-300 mb-4">No products found</div>
                  <p className="text-sm text-gray-400">
                    Start by adding your first product.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="border border-white/10 rounded-xl p-4 bg-white/5 backdrop-blur-sm">
                      <div className="flex items-start space-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{product.name}</h3>
                          <p className="text-sm text-gray-300 mb-2">{product.description}</p>
                          <p className="text-lg font-bold text-blue-400">${product.price}</p>
                          <p className="text-sm text-gray-400">{product.category}</p>
                          <p className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
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

export default Vendor; 