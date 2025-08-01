export default async function handler(req, res) {
  try {
    res.json({ 
      message: 'API is working',
      timestamp: new Date().toISOString(),
      method: req.method,
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({ message: 'Test API error', error: error.message });
  }
} 