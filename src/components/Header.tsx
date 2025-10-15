import React, { useState } from 'react';
import { ShoppingCart, Search, MapPin, Edit2, User, Menu as MenuIcon } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();
  const [deliveryLocation, setDeliveryLocation] = useState('Baliok');
  const [showLocationEdit, setShowLocationEdit] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={onMenuClick}
            className="flex items-center space-x-3"
          >
            {loading ? (
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-xl">
                {siteSettings?.site_name || "myNCCC.ph"}
              </div>
            )}
          </button>

          {/* Delivery Location */}
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">Delivering to:</span>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-900">{deliveryLocation}</span>
              <button 
                onClick={() => setShowLocationEdit(!showLocationEdit)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Edit2 className="h-3 w-3 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="What do you need?"
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Login/Register */}
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <button className="text-gray-700 hover:text-blue-600">Log In</button>
              <span className="text-gray-300">/</span>
              <button className="text-gray-700 hover:text-blue-600">Register</button>
            </div>

            {/* User Icon */}
            <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full">
              <User className="h-6 w-6 text-gray-700" />
            </button>

            {/* Cart */}
            <button 
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button 
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <MenuIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="What do you need?"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;