import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
  onViewAllCategories: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  selectedCategory, 
  onCategoryClick, 
  onViewAllCategories 
}) => {
  const { categories } = useCategories();

  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick(categoryId);
    onClose();
    
    // Scroll to products section
    setTimeout(() => {
      const productsSection = document.querySelector('[data-section="products"]');
      if (productsSection) {
        const headerHeight = 80;
        const offset = headerHeight + 20;
        const elementPosition = productsSection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleViewAllCategories = () => {
    onViewAllCategories();
    onClose();
    
    // Scroll to products section
    setTimeout(() => {
      const productsSection = document.querySelector('[data-section="products"]');
      if (productsSection) {
        const headerHeight = 80;
        const offset = headerHeight + 20;
        const elementPosition = productsSection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Mobile Menu */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Categories</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-sm">{category.name}</span>
                      </div>
                      {selectedCategory === category.id && (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={handleViewAllCategories}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  View All Categories
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
