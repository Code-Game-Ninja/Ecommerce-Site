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
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Check if response has content before trying to parse JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      throw new Error(`Server returned ${response.status}: ${text}`);
    }
    
    if (!response.ok) {
      throw new Error(data.message || `API request failed with status ${response.status}`);
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
    return apiRequest('/vendor/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (id, productData) => {
    return apiRequest(`/vendor/product-update?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id) => {
    return apiRequest(`/vendor/product-delete?id=${id}`, {
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
    return apiRequest(`/vendor/order-update?id=${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
}; 