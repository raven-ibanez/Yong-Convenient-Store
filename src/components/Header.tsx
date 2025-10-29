import React, { useState } from 'react';
import { ShoppingCart, Search, Menu as MenuIcon, X } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onLogoClick: () => void;
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick, onLogoClick, onSearch }) => {
  const { siteSettings, loading } = useSiteSettings();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="w-full px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button 
            onClick={onLogoClick}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-32 lg:w-40 h-12 lg:h-16 bg-gray-200 rounded animate-pulse" />
            ) : (
              <>
                {siteSettings?.site_logo ? (
                  <div className="flex items-center space-x-2">
                    <img 
                      src={siteSettings.site_logo} 
                      alt={siteSettings?.site_name || "myNCCC.ph"} 
                      className="h-12 w-12 lg:h-16 lg:w-16 object-contain"
                    />
                    <div className="bg-blue-600 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded font-bold text-lg lg:text-xl">
                      {siteSettings?.site_name || "myNCCC.ph"}
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-600 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded font-bold text-lg lg:text-xl">
                    {siteSettings?.site_name || "myNCCC.ph"}
                  </div>
                )}
              </>
            )}
          </button>


          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="What do you need?"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Facebook Link */}
            {siteSettings?.facebook_enabled && siteSettings?.facebook_url && (
              <a
                href={siteSettings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                title="Visit our Facebook page"
              >
                <svg className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}

            {/* Cart */}
            <button 
              onClick={onCartClick}
              className="relative p-1.5 lg:p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu - Show on mobile and tablet */}
            <button 
              onClick={onMenuClick}
              className="lg:hidden p-1.5 lg:p-2 hover:bg-gray-100 rounded-full"
            >
              <MenuIcon className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="What do you need?"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 pl-9 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;