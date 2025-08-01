import mongoose from 'mongoose';

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// User Schema (needed for population)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer', enum: ['customer', 'vendor'] }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

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

export default async function handler(req, res) {
  try {
    console.log('Products API called:', req.method);
    
    // Connect to database
    try {
      await connectDB();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({ message: 'Database connection failed' });
    }

    switch (req.method) {
      case 'GET':
        try {
          console.log('Fetching products...');
          const products = await Product.find().populate('vendor', 'name email').lean();
          console.log(`Found ${products.length} products`);
          
          // Return empty array if no products found
          if (!products || products.length === 0) {
            console.log('No products found in database');
            return res.json([]);
          }
          
          // Clean up products data
          const cleanProducts = products.map(product => ({
            ...product,
            vendor: product.vendor || null,
            vendorName: product.vendorName || 'Unknown Vendor'
          }));
          
          res.json(cleanProducts);
        } catch (getError) {
          console.error('Error fetching products:', getError);
          res.status(500).json({ message: 'Error fetching products', error: getError.message });
        }
        break;

      case 'POST':
        try {
          console.log('Creating product:', req.body);
          const product = new Product(req.body);
          await product.save();
          console.log('Product created successfully');
          res.status(201).json(product);
        } catch (postError) {
          console.error('Error creating product:', postError);
          res.status(500).json({ message: 'Error creating product' });
        }
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
} 