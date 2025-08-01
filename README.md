# Fashion Store Ecommerce Site

A modern ecommerce website built with React, Node.js, Express, and MongoDB for selling clothes and fashion items.

## Features

- 🛍️ **Product Catalog**: Browse through various clothing items
- 🛒 **Shopping Cart**: Add items, manage quantities, and checkout
- 👤 **User Authentication**: Register and login functionality
- 💳 **Order Management**: Place orders and track order history
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Built with Tailwind CSS for beautiful styling

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ecommerce-Site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```
   
   For MongoDB Atlas, use your connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas (cloud service)

## Running the Application

### Development Mode (Both Frontend and Backend)

```bash
npm run dev:full
```

This will start both the backend server (port 5000) and frontend development server (port 5173).

### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/seed-products` - Load sample products

### Orders
- `POST /api/orders` - Create new order (requires authentication)
- `GET /api/orders` - Get user orders (requires authentication)

## Usage

1. **Start the application** using `npm run dev:full`
2. **Load sample products** by clicking the "Load Sample Products" button
3. **Register or login** to access full features
4. **Browse products** and add them to your cart
5. **Checkout** to place orders

## Deployment

### Vercel Deployment

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables in Vercel dashboard:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key

3. **Deploy**
   - Vercel will automatically build and deploy your application
   - The frontend will be deployed to Vercel
   - For the backend, you'll need to deploy it separately (e.g., to Railway, Render, or Heroku)

### Backend Deployment Options

**Railway:**
- Connect your GitHub repository
- Set environment variables
- Deploy automatically

**Render:**
- Create a new Web Service
- Connect your repository
- Set build command: `npm install`
- Set start command: `node server.js`

**Heroku:**
- Install Heroku CLI
- Create a new app
- Deploy using Git

## Project Structure

```
Ecommerce-Site/
├── src/
│   ├── App.jsx          # Main React component
│   ├── main.jsx         # React entry point
│   └── assets/          # Static assets
├── server.js            # Express server
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
