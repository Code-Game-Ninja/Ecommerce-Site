// Auto-detect API URL based on environment
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : `${window.location.origin}/api`;

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    return apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    return apiRequest('/products');
  },

  getAllProducts: async () => {
    return apiRequest('/products');
  },

  getById: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  seedProducts: async () => {
    return apiRequest('/seed-products', {
      method: 'POST',
    });
  },

  // Vendor API for uploading products
  createProduct: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Get vendor's products
  getVendorProducts: async () => {
    return apiRequest('/vendor/products');
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getUserOrders: async () => {
    return apiRequest('/orders');
  },

  getAllOrders: async () => {
    return apiRequest('/admin/orders');
  },

  updateOrderStatus: async (orderId, status) => {
    return apiRequest(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Vendor Orders API
export const vendorOrdersAPI = {
  getAllOrders: async () => {
    return apiRequest('/vendor/orders');
  },

  updateOrderStatus: async (orderId, status) => {
    return apiRequest(`/vendor/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
}; 