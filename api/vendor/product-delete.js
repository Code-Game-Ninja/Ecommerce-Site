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

// Product Schema
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

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// User Schema for vendor lookup
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
    throw new Error('Only vendors can access this resource');
  }
  return user;
};

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
      const tokenData = authenticateToken(req);
      const vendor = await checkVendorRole(tokenData);

      // Check if product belongs to this vendor
      const existingProduct = await Product.findOne({ _id: id, vendor: vendor._id });
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found or access denied' });
      }

      await Product.findByIdAndDelete(id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      if (error.message.includes('token') || error.message.includes('vendors can access')) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  } catch (error) {
    console.error('Vendor product delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
} 