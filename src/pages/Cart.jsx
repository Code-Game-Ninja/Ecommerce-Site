import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../utils/api';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Navigate to checkout page
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center shadow-2xl">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-300 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={handleContinueShopping}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-xl font-semibold text-white">Cart Items ({cart.length})</h2>
                </div>
                <div className="divide-y divide-white/10">
                  {cart.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sticky top-8 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                
                                 <div className="space-y-3 mb-6">
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-300">Subtotal</span>
                     <span className="text-white">₹{getTotalPrice().toLocaleString('en-IN')}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-300">Shipping</span>
                     <span className="text-white">Free</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-300">Tax</span>
                     <span className="text-white">$0.00</span>
                   </div>
                   <div className="border-t border-white/10 pt-3">
                     <div className="flex justify-between font-semibold">
                       <span className="text-white">Total</span>
                       <span className="text-blue-400 text-lg">₹{getTotalPrice().toLocaleString('en-IN')}</span>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <button
                     onClick={handleCheckout}
                     disabled={loading}
                     className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                   >
                     {loading ? 'Processing...' : 'Proceed to Checkout'}
                   </button>
                   
                   <button
                     onClick={handleContinueShopping}
                     className="w-full bg-white/10 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                   >
                     Continue Shopping
                   </button>
                 </div>

                {!isLoggedIn && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Please <button 
                        onClick={() => navigate('/login')}
                        className="underline font-medium"
                      >
                        login
                      </button> to complete your purchase.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 