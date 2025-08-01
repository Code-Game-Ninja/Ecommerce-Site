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
          const user = authenticateToken(req);
          const orders = await Order.find({ user: user.userId }).populate('products.product');
          res.json(orders);
        } catch (error) {
          res.status(401).json({ message: error.message });
        }
        break;

      case 'POST':
        try {
          const user = authenticateToken(req);
          const order = new Order({
            user: user.userId,
            ...req.body
          });
          await order.save();
          res.status(201).json(order);
        } catch (error) {
          if (error.message.includes('token')) {
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
    console.error('Orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
} 