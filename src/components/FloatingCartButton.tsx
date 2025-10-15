import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  onCartClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, onCartClick }) => {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onCartClick}
      className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 bg-red-600 text-white p-3 lg:p-4 rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-110 z-40 lg:hidden"
    >
      <div className="relative">
        <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
        <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-yellow-400 text-black text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center font-medium">
          {itemCount}
        </span>
      </div>
    </button>
  );
};

export default FloatingCartButton;