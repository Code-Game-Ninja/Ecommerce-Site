import mongoose from 'mongoose';

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// Product Schema (same as main products API)
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Adding sample products...');
    await connectDB();

    const sampleProducts = [
      {
        name: 'Classic White T-Shirt',
        description: 'Premium cotton t-shirt with a comfortable fit',
        price: 2074,
        category: 'T-Shirts',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        stock: 50,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Navy'],
        vendorName: 'Fashion Store'
      },
      {
        name: 'Denim Jeans',
        description: 'High-quality denim jeans with perfect fit',
        price: 6647,
        category: 'Jeans',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        stock: 30,
        sizes: ['30', '32', '34', '36'],
        colors: ['Blue', 'Black'],
        vendorName: 'Denim World'
      },
      {
        name: 'Casual Hoodie',
        description: 'Warm and comfortable hoodie for everyday wear',
        price: 4982,
        category: 'Hoodies',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        stock: 25,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Gray', 'Black', 'Navy'],
        vendorName: 'Comfort Wear'
      },
      {
        name: 'Formal Shirt',
        description: 'Elegant formal shirt for professional occasions',
        price: 7474,
        category: 'Shirts',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
        stock: 20,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Blue', 'Pink'],
        vendorName: 'Professional Attire'
      },
      {
        name: 'Summer Dress',
        description: 'Beautiful summer dress with floral pattern',
        price: 5814,
        category: 'Dresses',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500',
        stock: 15,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Floral', 'Blue', 'Pink'],
        vendorName: 'Elegant Fashion'
      },
      {
        name: 'Sneakers',
        description: 'Comfortable sneakers for daily use',
        price: 8307,
        category: 'Shoes',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        stock: 40,
        sizes: ['7', '8', '9', '10'],
        colors: ['White', 'Black', 'Red'],
        vendorName: 'Footwear Plus'
      }
    ];

    // Clear existing products first
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products`);

    res.json({ 
      message: 'Sample products added successfully',
      count: insertedProducts.length,
      products: insertedProducts
    });
  } catch (error) {
    console.error('Add sample products error:', error);
    res.status(500).json({ message: 'Error adding sample products', error: error.message });
  }
} 