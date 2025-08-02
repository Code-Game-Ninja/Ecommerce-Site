import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// Authentication middleware
const authenticateToken = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Access token required');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new Error('Invalid token');
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer', enum: ['customer', 'vendor'] }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Check if user is vendor
const checkVendorRole = async (tokenData) => {
  // First check if role is in token payload
  if (tokenData.role && tokenData.role === 'vendor') {
    return { _id: tokenData.userId, role: 'vendor' };
  }
  
  // If not in token, fetch from database
  const user = await User.findById(tokenData.userId);
  if (!user || user.role !== 'vendor') {
    throw new Error('Vendor access required');
  }
  return user;
};

// Product Schema (needed for population)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, default: 0 },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vendorName: { type: String }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  shippingInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    try {
      const tokenData = authenticateToken(req);
      await checkVendorRole(tokenData);
      
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('user', 'name email')
       .populate('products.product', 'name image category vendor vendorName');
      
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error('Update order status error:', error);
      if (error.message.includes('token') || error.message.includes('Vendor access')) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  } catch (error) {
    console.error('Vendor order update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
} 