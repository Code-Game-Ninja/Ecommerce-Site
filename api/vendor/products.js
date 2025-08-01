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
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (err) {
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
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorName: { type: String, required: true }
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
  try {
    await connectDB();

    if (req.method === 'GET') {
      try {
        const tokenData = authenticateToken(req);
        const vendor = await checkVendorRole(tokenData);
        const products = await Product.find({ vendor: vendor._id }).populate('vendor', 'name email');
        res.json(products);
      } catch (error) {
        res.status(401).json({ message: error.message });
      }
    } else if (req.method === 'POST') {
      try {
        const tokenData = authenticateToken(req);
        const vendor = await checkVendorRole(tokenData);

        // Ensure vendor fields are provided
        const productData = {
          ...req.body,
          vendor: vendor._id,
          vendorName: vendor.name
        };

        // Validate required fields
        if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.image) {
          return res.status(400).json({ message: 'Missing required fields: name, description, price, category, image' });
        }

        const product = new Product(productData);
        await product.save();
        
        res.status(201).json(product);
      } catch (error) {
        console.error('Vendor product creation error:', error);
        if (error.message.includes('token') || error.message.includes('vendors can access')) {
          res.status(401).json({ message: error.message });
        } else if (error.name === 'ValidationError') {
          res.status(400).json({ message: error.message });
        } else {
          res.status(400).json({ message: error.message });
        }
      }
    } else if (req.method === 'PUT') {
      try {
        const tokenData = authenticateToken(req);
        const vendor = await checkVendorRole(tokenData);
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if product belongs to this vendor
        const existingProduct = await Product.findOne({ _id: id, vendor: vendor._id });
        if (!existingProduct) {
          return res.status(404).json({ message: 'Product not found or access denied' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          { ...req.body, vendor: vendor._id, vendorName: vendor.name },
          { new: true }
        ).populate('vendor', 'name email');

        res.json(updatedProduct);
      } catch (error) {
        if (error.message.includes('token') || error.message.includes('vendors can access')) {
          res.status(401).json({ message: error.message });
        } else {
          res.status(400).json({ message: error.message });
        }
      }
    } else if (req.method === 'DELETE') {
      try {
        const tokenData = authenticateToken(req);
        const vendor = await checkVendorRole(tokenData);
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if product belongs to this vendor
        const existingProduct = await Product.findOne({ _id: id, vendor: vendor._id });
        if (!existingProduct) {
          return res.status(404).json({ message: 'Product not found or access denied' });
        }

        await Product.findByIdAndDelete(id);
        res.json({ message: 'Product deleted successfully' });
      } catch (error) {
        if (error.message.includes('token') || error.message.includes('vendors can access')) {
          res.status(401).json({ message: error.message });
        } else {
          res.status(400).json({ message: error.message });
        }
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Vendor products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
} 