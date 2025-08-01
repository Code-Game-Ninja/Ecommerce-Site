import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { isLoggedIn, user, loading } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  // Update shipping info when user data is available
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [isLoggedIn, cart, navigate]);

  // Add error boundary for debugging
  if (!cart) {
    console.error('Cart is undefined');
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  // Add loading state while checking authentication
  if (!isLoggedIn && !loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Redirecting to login...</div>;
  }

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        products: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotalPrice(),
        shippingInfo,
        paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'processing'
      };

      await ordersAPI.create(orderData);
      clearCart();
      setOrderSuccess(true);
      
      // Redirect to success page after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center shadow-2xl max-w-md w-full">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-300 mb-4">
            Your order has been confirmed. You will receive an email confirmation shortly.
          </p>
          <div className="text-sm text-gray-400">
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <p className="text-gray-300">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Shipping Information</h2>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-purple-500 focus:ring-purple-500"
                  />
                  <div className="flex items-center space-x-3">
                    <Truck className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="font-medium text-white">Cash on Delivery</div>
                      <div className="text-sm text-gray-400">Pay when you receive your order</div>
                    </div>
                  </div>
                </label>

                {/* UPI */}
                <label className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-purple-500 focus:ring-purple-500"
                  />
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="font-medium text-white">UPI Payment</div>
                      <div className="text-sm text-gray-400">Pay using UPI apps</div>
                    </div>
                  </div>
                </label>

                {/* Credit/Debit Card */}
                <label className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-purple-500 focus:ring-purple-500"
                  />
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="font-medium text-white">Credit/Debit Card</div>
                      <div className="text-sm text-gray-400">Secure card payment</div>
                    </div>
                  </div>
                </label>

                {/* Digital Wallet */}
                <label className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-purple-500 focus:ring-purple-500"
                  />
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-6 h-6 text-yellow-400" />
                    <div>
                      <div className="font-medium text-white">Digital Wallet</div>
                      <div className="text-sm text-gray-400">Paytm, PhonePe, etc.</div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Payment Method Notices */}
              {paymentMethod === 'cod' && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-300">Cash on Delivery available for orders above ₹500</span>
                  </div>
                </div>
              )}
              
              {paymentMethod !== 'cod' && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-yellow-300">Online payment gateway is under construction</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/10 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>${(getTotalPrice() * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-2">
                  <span>Total</span>
                  <span>${(getTotalPrice() + (getTotalPrice() * 0.18)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Order...</span>
                </div>
              ) : (
                `Place Order - $${(getTotalPrice() + (getTotalPrice() * 0.18)).toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 