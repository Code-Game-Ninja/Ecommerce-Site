import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { GlowCard } from './GlowCard';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <GlowCard 
        glowColor="purple" 
        customSize={true}
        className="group relative overflow-hidden w-full"
      >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Like button */}
      <motion.button
        onClick={handleLike}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-red-500/20 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart 
          className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} 
        />
      </motion.button>

      {/* Product Image */}
      <div className="relative overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-700"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
        />
        
        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Quick view button */}
        <motion.button
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
            <Eye className="w-6 h-6 text-white" />
          </div>
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="relative z-10 p-6">
        {/* Category badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 text-xs font-medium mb-3 border border-purple-500/30">
          {product.category}
        </div>

        {/* Product name */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Product description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
              />
            ))}
          </div>
          <span className="text-gray-400 text-sm ml-2">(4.0)</span>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <span className={`text-sm px-2 py-1 rounded-full ${
            product.stock > 10 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : product.stock > 0 
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          disabled={product.stock === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </motion.button>

        {/* Stock indicator */}
        {product.stock > 0 && product.stock <= 10 && (
          <div className="mt-3 text-center">
            <span className="text-yellow-400 text-sm">
              Only {product.stock} left in stock!
            </span>
          </div>
        )}
      </div>

      {/* Floating elements for 3D effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full blur-sm animate-pulse delay-1000"></div>
      </div>
      </GlowCard>
    </motion.div>
  );
};

export default ProductCard; 