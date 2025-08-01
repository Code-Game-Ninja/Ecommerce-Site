# 🛍️ Modern E-commerce Fashion Store

A full-stack e-commerce platform built with React 19, Node.js, and MongoDB, featuring a modern 3D design with glassmorphism effects, GSAP animations, and comprehensive vendor management system.

## ✨ Features

### 🎨 **Modern Design & UX**
- **3D Glassmorphism Design** - Translucent UI with gradient backgrounds
- **GSAP Animations** - Smooth scrolling animations and transitions
- **WebGL Orb Background** - Interactive animated background
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Theme** - Modern dark purple and blue gradient theme

### 🛍️ **E-commerce Features**
- **Product Catalog** - Browse 32+ categories with advanced filtering
- **Shopping Cart** - Add items, manage quantities, and secure checkout
- **User Authentication** - JWT-based login/signup with role management
- **Order Management** - Complete order tracking and history
- **Vendor Dashboard** - Comprehensive vendor management system
- **Payment Integration** - Multiple payment options (COD, UPI, Cards)

### 👥 **User Roles & Management**
- **Customer** - Browse, cart, checkout, order tracking
- **Vendor** - Product management, order fulfillment, analytics
- **Role-based Access** - Secure API endpoints and protected routes

### 💰 **Currency & Localization**
- **Indian Rupee (₹)** - All prices in INR with proper formatting
- **Localized Number Formatting** - Indian number system (e.g., 1,00,000)

## 🚀 Tech Stack

### **Frontend**
- **React 19** - Latest React with concurrent features
- **Vite 7** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12** - Advanced animations
- **GSAP 3** - Professional-grade animations
- **Lucide React** - Beautiful icon library
- **OGL** - WebGL background effects

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### **Deployment**
- **Vercel** - Frontend and serverless functions
- **MongoDB Atlas** - Cloud database
- **GitHub** - Version control

## 📦 Installation

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Code-Game-Ninja/Ecommerce-Site.git
   cd Ecommerce-Site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🏃‍♂️ Running the Application

### **Development Mode**
```bash
npm run dev
```
- Starts Vite dev server on port 5173
- Hot module replacement enabled
- Uses Vercel serverless functions for API

### **Production Build**
```bash
npm run build
```
- Creates optimized production build
- Ready for deployment

### **Preview Production Build**
```bash
npm run preview
```
- Serves the production build locally

## 🗂️ Project Structure

```
Ecommerce-Site/
├── api/                    # Vercel serverless functions
│   ├── login.js           # Authentication
│   ├── register.js        # User registration
│   ├── products.js        # Product management
│   ├── orders.js          # Order processing
│   ├── add-sample-products.js # Sample data
│   └── vendor/            # Vendor-specific APIs
│       ├── products.js    # Vendor product management
│       └── orders.js      # Vendor order management
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.jsx     # Navigation header
│   │   ├── ProductCard.jsx # Product display
│   │   ├── CartItem.jsx   # Cart item component
│   │   ├── Orb.jsx        # WebGL background
│   │   ├── TextType.jsx   # Typing animations
│   │   ├── ErrorBoundary.jsx # Error handling
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── pages/             # Page components
│   │   ├── Home.jsx       # Landing page
│   │   ├── Products.jsx   # Product catalog
│   │   ├── Cart.jsx       # Shopping cart
│   │   ├── Checkout.jsx   # Checkout process
│   │   ├── Login.jsx      # User login
│   │   ├── Signup.jsx     # User registration
│   │   ├── Dashboard.jsx  # User dashboard
│   │   ├── VendorDashboard.jsx # Vendor management
│   │   └── NotFound.jsx   # 404 page
│   ├── context/           # React contexts
│   │   ├── AuthContext.jsx # Authentication state
│   │   └── CartContext.jsx # Shopping cart state
│   ├── utils/             # Utility functions
│   │   └── api.js         # API utilities
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── vercel.json            # Vercel configuration
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Dependencies and scripts
```

## 🔌 API Endpoints

### **Authentication**
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### **Products**
- `GET /api/products` - Get all products
- `POST /api/add-sample-products` - Add sample products

### **Vendor Management**
- `GET /api/vendor/products` - Get vendor's products
- `POST /api/vendor/products` - Create product (vendor only)
- `PUT /api/vendor/products/:id` - Update product (vendor only)
- `DELETE /api/vendor/products/:id` - Delete product (vendor only)

### **Orders**
- `POST /api/orders` - Create order (authenticated)
- `GET /api/orders` - Get user orders (authenticated)
- `GET /api/vendor/orders` - Get vendor orders (vendor only)
- `PUT /api/vendor/orders/:id` - Update order status (vendor only)

## 🎯 Key Features Explained

### **Vendor Dashboard**
- **Product Management** - Add, edit, delete products
- **Order Fulfillment** - Process and update order status
- **Analytics** - Revenue tracking and order statistics
- **Customer Data** - View customer information for orders

### **Advanced Filtering**
- **32 Product Categories** - Comprehensive categorization
- **Price Range Filter** - Filter by price (₹0 - ₹10,000)
- **Search Functionality** - Search by name and description
- **Sort Options** - Sort by name, price, date

### **Modern UI/UX**
- **Glassmorphism Effects** - Translucent cards and panels
- **Smooth Animations** - GSAP-powered transitions
- **Interactive Background** - WebGL orb animation
- **Responsive Design** - Works on all devices

## 🌐 Deployment

### **Vercel Deployment (Recommended)**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables**
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Your JWT secret key

### **Live Demo**
Visit: [https://ecommerce-site-umber.vercel.app](https://ecommerce-site-umber.vercel.app)

## 🔧 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT token secret key | Yes | `your-super-secret-key` |

## 🛠️ Development

### **Adding New Features**
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test thoroughly
3. Commit changes: `git commit -m "Add new feature"`
4. Push and create pull request

### **Code Style**
- Use ES6+ features
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/Code-Game-Ninja/Ecommerce-Site/issues)
- **Documentation**: Check the code comments and this README
- **Deployment Issues**: Refer to DEPLOYMENT.md

## 🎉 Acknowledgments

- **React Team** - For the amazing framework
- **Vercel** - For seamless deployment
- **Tailwind CSS** - For the utility-first CSS framework
- **MongoDB** - For the reliable database
- **GSAP** - For professional animations

---

**Built with ❤️ using modern web technologies**
