import mongoose from 'mongoose';

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'POST') {
      const { email, role } = req.body;
      
      if (!email || !role) {
        return res.status(400).json({ message: 'Email and role are required' });
      }

      const user = await User.findOneAndUpdate(
        { email },
        { role },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User role updated successfully', user });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
} 