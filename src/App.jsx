import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Orb from './components/Orb';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

import VendorDashboard from './pages/VendorDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import GlowCardDemo from './components/GlowCardDemo';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Initialize GSAP animations
    gsap.set("body", { overflow: "auto" });
    
    // Smooth scroll effect
    gsap.to("html, body", {
      scrollBehavior: "smooth",
      duration: 0.1
    });

    // Page load animation
    gsap.fromTo(".app-container", 
      { 
        opacity: 0, 
        y: 20,
        scale: 0.95
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "easeOut"
      }
    );

    // Global error handler for authentication issues
    const handleGlobalError = (event) => {
      if (event.error && event.error.message && 
          (event.error.message.includes('Invalid token') || 
           event.error.message.includes('Authentication failed'))) {
        // Clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Cleared invalid authentication tokens');
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.message && 
          (event.reason.message.includes('Invalid token') || 
           event.reason.message.includes('Authentication failed'))) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Cleared invalid authentication tokens from unhandled rejection');
      }
    });

    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  return (
    <div className="app-container min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Orb Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <Orb 
          hue={30} 
          hoverIntensity={0.1} 
          rotateOnHover={false}
        />
      </div>

      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="relative z-10">
              <Header />
              <main className="pt-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/login" element={
                    <ProtectedRoute requireAuth={false}>
                      <Login />
                    </ProtectedRoute>
                  } />
                  <Route path="/signup" element={
                    <ProtectedRoute requireAuth={false}>
                      <Signup />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />

                  <Route path="/vendor-dashboard" element={
                    <ProtectedRoute requireVendor={true}>
                      <VendorDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={
                    <ErrorBoundary>
                      <Checkout />
                    </ErrorBoundary>
                  } />
                  <Route path="/glow-demo" element={<GlowCardDemo />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.6;
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #8b5cf6, #3b82f6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #7c3aed, #2563eb);
        }
      `}</style>
    </div>
  );
}

export default App;
