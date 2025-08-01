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

// Check if user is vendor
const checkVendorRole = (user) => {
  if (user.role !== 'vendor') {
    throw new Error('Vendor access required');
  }
};

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

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default async function handler(req, res) {
  try {
    await connectDB();

    switch (req.method) {
      case 'GET':
        try {
          console.log('Vendor Orders API - GET request received');
          const user = authenticateToken(req);
          console.log('Authenticated user:', user);
          checkVendorRole(user);
          console.log('Vendor role check passed');
          
          // Get all orders with populated user and product details
          const orders = await Order.find()
            .populate('user', 'name email')
            .populate('products.product', 'name image category')
            .sort({ createdAt: -1 });
          
          console.log('Found orders:', orders.length);
          res.json(orders);
        } catch (error) {
          console.error('Vendor Orders API Error:', error);
          if (error.message.includes('token') || error.message.includes('Vendor access')) {
            res.status(401).json({ message: error.message });
          } else {
            res.status(500).json({ message: 'Server error' });
          }
        }
        break;

      case 'PUT':
        try {
          const user = authenticateToken(req);
          checkVendorRole(user);
          
          const { id } = req.query;
          const { status } = req.body;
          
          if (!id || !status) {
            return res.status(400).json({ message: 'Order ID and status are required' });
          }
          
          const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
          ).populate('user', 'name email')
           .populate('products.product', 'name image category');
          
          if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
          }
          
          res.json(updatedOrder);
        } catch (error) {
          if (error.message.includes('token') || error.message.includes('Vendor access')) {
            res.status(401).json({ message: error.message });
          } else {
            res.status(500).json({ message: 'Server error' });
          }
        }
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Vendor Orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
} 