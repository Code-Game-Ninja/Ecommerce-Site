import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center space-x-3 p-6 border-b border-white/10">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="text-sm font-medium text-white">{item.name}</h4>
        <p className="text-sm text-gray-300">${item.price}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 text-white"
        >
          -
        </button>
        <span className="text-sm w-8 text-center text-white">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 text-white"
        >
          +
        </button>
        <button
          onClick={() => removeFromCart(item._id)}
          className="ml-2 text-red-400 hover:text-red-300 transition-colors duration-300"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CartItem; 