import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useSiteSettings } from '../hooks/useSiteSettings';
import MenuItemCard from './MenuItemCard';
import PromoBanner from './PromoBanner';
import { Package, Truck, ShoppingBag, ShoppingCart } from 'lucide-react';
import { categories as fallbackCategories } from '../data/menuData';

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  selectedCategory: string;
  searchTerm?: string;
  onCategoryClick?: (categoryId: string) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity, selectedCategory, searchTerm = '', onCategoryClick }) => {
  const { categories } = useCategories();
  const { siteSettings } = useSiteSettings();
  const [activeCategory, setActiveCategory] = React.useState('hot-coffee');

  // Helper function to get category descriptions
  const getCategoryDescription = (categoryId: string) => {
    const descriptions: { [key: string]: string } = {
      'breads-spreads-oats-cereals': 'Fresh breads, spreads, oats and cereals',
      'beverages': 'Drinks, juices, and refreshments',
      'household-essentials': 'Cleaning supplies and household items',
      'medicines-health-care-products': 'Medicines and health care products',
      'dim-sum': 'Traditional Chinese dumplings and small plates',
      'noodles': 'Asian noodle dishes and soups',
      'rice-dishes': 'Rice-based meals and fried rice',
      'hot-coffee': 'Freshly brewed hot coffee drinks',
      'iced-coffee': 'Refreshing cold coffee beverages',
      'non-coffee': 'Teas, smoothies, and other drinks',
      'food': 'Delicious food and pastries'
    };
    return descriptions[categoryId] || 'Quality products for your needs';
  };

  // Calculate item counts per category
  const getCategoryItemCount = (categoryId: string) => {
    try {
      if (!Array.isArray(menuItems)) {
        console.warn('menuItems is not an array:', menuItems);
        return 0;
      }
      return menuItems.filter(item => item && item.category === categoryId).length;
    } catch (error) {
      console.error('Error counting items for category:', categoryId, error);
      return 0;
    }
  };

  // Get featured categories dynamically from the database
  const featuredCategories = React.useMemo(() => {
    try {
      console.log('Calculating featured categories...', { 
        categoriesLength: categories?.length, 
        menuItemsLength: menuItems?.length,
        categories: categories,
        menuItems: menuItems
      });

      // Ensure categories and menuItems are arrays
      if (!Array.isArray(categories) || !Array.isArray(menuItems)) {
        console.warn('Categories or menuItems are not arrays:', { categories, menuItems });
        return [];
      }

      // If no categories, use fallback categories
      if (categories.length === 0) {
        console.warn('No categories available, using fallback categories');
        const fallbackWithCounts = fallbackCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: getCategoryDescription(cat.id),
          icon: cat.icon,
          count: getCategoryItemCount(cat.id)
        }));
        
        return fallbackWithCounts
          .filter(category => (category?.count || 0) > 0)
          .sort((a, b) => (b?.count || 0) - (a?.count || 0))
          .slice(0, 4);
      }

      // Create category data with item counts
      const categoriesWithCounts = categories.map(category => {
        if (!category || typeof category !== 'object') {
          console.warn('Invalid category:', category);
          return null;
        }
        
        const count = getCategoryItemCount(category.id || 'unknown');
        console.log(`Category ${category.name}: ${count} items`);
        
        return {
          id: category.id || 'unknown',
          name: category.name || 'Unknown Category',
          description: getCategoryDescription(category.id || 'unknown'),
          icon: category.icon || '📦',
          count: count
        };
      }).filter(Boolean); // Remove null entries

      console.log('Categories with counts:', categoriesWithCounts);

      // Filter out categories with 0 items, then sort by item count (descending) and take top 4
      const featured = categoriesWithCounts
        .filter(category => (category?.count || 0) > 0)
        .sort((a, b) => (b?.count || 0) - (a?.count || 0))
        .slice(0, 4);

      console.log('Featured categories result:', featured);
      return featured;
    } catch (error) {
      console.error('Error calculating featured categories:', error);
      // Return fallback categories if everything fails
      return fallbackCategories.slice(0, 4).map(cat => ({
        id: cat.id,
        name: cat.name,
        description: getCategoryDescription(cat.id),
        icon: cat.icon,
        count: 0
      }));
    }
  }, [categories, menuItems]);

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      // Preload images for visible category first
      const visibleItems = menuItems.filter(item => item.category === activeCategory);
      preloadImages(visibleItems);
      
      // Then preload other images after a short delay
      setTimeout(() => {
        const otherItems = menuItems.filter(item => item.category !== activeCategory);
        preloadImages(otherItems);
      }, 1000);
    }
  }, [menuItems, activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    
    // Scroll to products section after a short delay to allow category selection to update
    setTimeout(() => {
      const productsSection = document.querySelector('[data-section="products"]');
      if (productsSection) {
        const headerHeight = 80; // Header height
        const offset = headerHeight + 20; // Extra padding
        const elementPosition = productsSection.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  React.useEffect(() => {
    if (categories.length > 0) {
      // Set default to dim-sum if it exists, otherwise first category
      const defaultCategory = categories.find(cat => cat.id === 'dim-sum') || categories[0];
      if (!categories.find(cat => cat.id === activeCategory)) {
        setActiveCategory(defaultCategory.id);
      }
    }
  }, [categories, activeCategory]);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <main className="px-3 sm:px-4 lg:px-8 py-4 lg:py-6">
        {/* Promotional Banners Section */}
        {(siteSettings?.banner_pickup_enabled || siteSettings?.banner_delivery_enabled) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
            {/* Main Promo Banner - Pickup Highlight */}
            {siteSettings?.banner_pickup_enabled && (
              <div className="lg:col-span-2">
                <PromoBanner
                  title={siteSettings?.promo_pickup_title || "PICK-UP HIGHLIGHT"}
                  subtitle={siteSettings?.promo_pickup_subtitle || "GET P200 OFF WHEN YOU PICK UP YOUR ORDER!"}
                  code={siteSettings?.promo_pickup_code || "PICKUPSEPTEMBER"}
                  promoDates={siteSettings?.promo_pickup_dates || "September 15 & 30"}
                  minPurchase={siteSettings?.promo_pickup_min_purchase || "P1,500"}
                  bgColor="bg-orange-500"
                  textColor="text-white"
                  image={
                    <div className="flex items-center space-x-2 lg:space-x-4">
                      <Package className="h-16 w-16 lg:h-32 lg:w-32" />
                      <ShoppingCart className="h-16 w-16 lg:h-32 lg:w-32" />
                    </div>
                  }
                  className="h-full"
                />
              </div>
            )}

            {/* Delivery Schedule */}
            {siteSettings?.banner_delivery_enabled && (
              <div className="space-y-3 lg:space-y-4">
                <PromoBanner
                  title={siteSettings?.promo_delivery_title || "Delivery Schedule"}
                  subtitle={siteSettings?.promo_delivery_subtitle || "Orders received before 11am Same Day Delivery"}
                  bgColor="bg-blue-500"
                  textColor="text-white"
                  image={<Truck className="h-12 w-12 lg:h-24 lg:w-24" />}
                  className="text-sm"
                />
              </div>
            )}
          </div>
        )}

        {/* Payday Specials Banner */}
        {siteSettings?.banner_payday_enabled && (
          <div className="mb-6 lg:mb-8">
            <PromoBanner
              title={siteSettings?.promo_payday_title || "PAYDAY SPECIALS"}
              subtitle={siteSettings?.promo_payday_subtitle || "FREE DELIVERY"}
              code={siteSettings?.promo_payday_code || "SAHODNASEP"}
              promoDates={siteSettings?.promo_payday_dates || "on September 15 and 30, 2025 with a min. spend of P3,000"}
              bgColor="bg-red-600"
              textColor="text-white"
              image={<ShoppingBag className="h-16 w-16 lg:h-32 lg:w-32" />}
              className="w-full"
            />
          </div>
        )}

        {/* Featured Categories Preview */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Featured Categories</h2>
            <button 
              onClick={() => onCategoryClick?.('all')}
              className="text-blue-600 hover:text-blue-700 text-xs lg:text-sm font-semibold"
            >
              View All Categories
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="col-span-full text-xs text-gray-500 mb-2">
                Debug: {featuredCategories.length} featured categories found
              </div>
            )}
            {/* Featured Category Cards */}
            {featuredCategories.map((category) => (
              <div 
                key={category.id}
                onClick={() => {
                  onCategoryClick?.(category.id);
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
                }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-3 lg:p-6 cursor-pointer group hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-2xl lg:text-4xl mb-2 lg:mb-3 group-hover:scale-110 transition-transform duration-200">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base">
                    {category.name}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-4 hidden lg:block">
                    {category.description}
                  </p>
                  <div className="text-xs text-gray-500 bg-gray-50 px-2 lg:px-3 py-1 rounded-full">
                    {category.count} {category.count === 1 ? 'item' : 'items'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-6 lg:mb-8" data-section="products">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-2">
            <div className="flex items-center">
              <span className="text-xl lg:text-2xl mr-2 lg:mr-3">
                {searchTerm ? '🔍' : selectedCategory === 'all' ? '🛒' : '📦'}
              </span>
              <h3 className="text-lg lg:text-2xl font-semibold text-gray-900">
                {searchTerm 
                  ? `Search Results for "${searchTerm}"` 
                  : selectedCategory === 'all' 
                    ? 'All Products'
                    : `Products in ${categories.find(cat => cat.id === selectedCategory)?.name || 'Category'}`
                }
              </h3>
            </div>
            <div className="text-xs lg:text-sm text-gray-500">
              {menuItems.length} product{menuItems.length !== 1 ? 's' : ''} available
            </div>
          </div>
          {/* Pricing Note */}
          {siteSettings?.pricing_note && (
            <div className="mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 text-center">
                  <span className="font-semibold">Note:</span> {siteSettings.pricing_note}
                </p>
              </div>
            </div>
          )}
          
          {menuItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {menuItems.map((item) => {
                // Find cart items that match this menu item (base item without variations/add-ons)
                const matchingCartItems = cartItems.filter(cartItem => 
                  cartItem.id.startsWith(item.id + '-')
                );
                // Calculate total quantity for this item across all variations
                const totalQuantity = matchingCartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
                
                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    quantity={totalQuantity}
                    onUpdateQuantity={(id, quantity) => {
                      // Find the first matching cart item to update
                      const cartItem = matchingCartItems[0];
                      if (cartItem) {
                        updateQuantity(cartItem.id, quantity);
                      }
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 lg:py-12">
              {searchTerm ? (
                <>
                  <div className="text-gray-400 text-4xl lg:text-6xl mb-3 lg:mb-4">🔍</div>
                  <h4 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">No Results Found</h4>
                  <p className="text-sm lg:text-base text-gray-500 px-4">No products found for "{searchTerm}". Try a different search term.</p>
                </>
              ) : selectedCategory === 'all' ? (
                <>
                  <div className="text-gray-400 text-4xl lg:text-6xl mb-3 lg:mb-4">🛒</div>
                  <h4 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">No Products Available</h4>
                  <p className="text-sm lg:text-base text-gray-500 px-4">Products will appear here once they are added to the database.</p>
                </>
              ) : (
                <>
                  <div className="text-gray-400 text-4xl lg:text-6xl mb-3 lg:mb-4">📦</div>
                  <h4 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">No Products in This Category</h4>
                  <p className="text-sm lg:text-base text-gray-500 px-4">No products found in this category. Try selecting a different category or view all products.</p>
                </>
              )}
            </div>
          )}
        </div>
    </main>
  );
};

export default Menu;