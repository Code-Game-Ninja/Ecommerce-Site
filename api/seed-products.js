import mongoose from 'mongoose';

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, default: 0 }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const sampleProducts = [
      {
        name: 'Classic White T-Shirt',
        description: 'Premium cotton t-shirt with a comfortable fit',
        price: 29.99,
        category: 'T-Shirts',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        stock: 50
      },
      {
        name: 'Denim Jeans',
        description: 'High-quality denim jeans with perfect fit',
        price: 79.99,
        category: 'Jeans',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        stock: 30
      },
      {
        name: 'Casual Hoodie',
        description: 'Warm and comfortable hoodie for everyday wear',
        price: 59.99,
        category: 'Hoodies',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        stock: 25
      },
      {
        name: 'Formal Shirt',
        description: 'Elegant formal shirt for professional occasions',
        price: 89.99,
        category: 'Shirts',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
        stock: 20
      },
      {
        name: 'Summer Dress',
        description: 'Beautiful summer dress with floral pattern',
        price: 69.99,
        category: 'Dresses',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500',
        stock: 15
      },
      {
        name: 'Sneakers',
        description: 'Comfortable sneakers for daily use',
        price: 99.99,
        category: 'Shoes',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        stock: 40
      }
    ];

    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    
    res.json({ message: 'Sample products seeded successfully' });
  } catch (error) {
    console.error('Seed products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
} 