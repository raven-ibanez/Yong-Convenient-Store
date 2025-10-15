import React from 'react';
import { useCategories } from '../hooks/useCategories';
import { ChevronRight } from 'lucide-react';

interface CategorySidebarProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-80px)] overflow-y-auto sticky top-20">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">ALL CATEGORIES</h2>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onCategoryClick(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
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
          <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
            View All Categories
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CategorySidebar;

