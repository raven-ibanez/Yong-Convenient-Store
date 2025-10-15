import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import MenuItemCard from './MenuItemCard';
import MobileNav from './MobileNav';
import PromoBanner from './PromoBanner';
import { Package, Truck, ShoppingCart, Heart, ShoppingBag, Stethoscope, Shirt, Dog } from 'lucide-react';

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
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity }) => {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = React.useState('hot-coffee');

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
    const element = document.getElementById(categoryId);
    if (element) {
      const headerHeight = 64; // Header height
      const mobileNavHeight = 60; // Mobile nav height
      const offset = headerHeight + mobileNavHeight + 20; // Extra padding
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
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
    <>
      <MobileNav 
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Promotional Banners Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Main Promo Banner - Pickup Highlight */}
          <div className="lg:col-span-2">
            <PromoBanner
              title="PICK-UP HIGHLIGHT"
              subtitle="GET P200 OFF WHEN YOU PICK UP YOUR ORDER!"
              code="PICKUPSEPTEMBER"
              promoDates="September 15 & 30"
              minPurchase="P1,500"
              bgColor="bg-orange-500"
              textColor="text-white"
              image={
                <div className="flex items-center space-x-4">
                  <Package className="h-32 w-32" />
                  <ShoppingCart className="h-32 w-32" />
                </div>
              }
              className="h-full"
            />
          </div>

          {/* Delivery Schedule */}
          <div className="space-y-4">
            <PromoBanner
              title="Delivery Schedule"
              subtitle="Orders received before 11am Same Day Delivery"
              bgColor="bg-blue-500"
              textColor="text-white"
              image={<Truck className="h-24 w-24" />}
              className="text-sm"
            />
          </div>
        </div>

        {/* Payday Specials Banner */}
        <div className="mb-8">
          <PromoBanner
            title="PAYDAY SPECIALS"
            subtitle="FREE DELIVERY"
            code="SAHODNASEP"
            promoDates="on September 15 and 30, 2025 with a min. spend of P3,000"
            bgColor="bg-red-600"
            textColor="text-white"
            image={<ShoppingBag className="h-32 w-32" />}
            className="w-full"
          />
        </div>

        {/* Department Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Grocery Shopping */}
          <div className="relative rounded-lg overflow-hidden group cursor-pointer">
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <ShoppingCart className="h-16 w-16 text-white opacity-50" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <p className="text-white font-semibold text-sm">Grocery Shopping</p>
            </div>
          </div>

          {/* Pharmacy */}
          <div className="relative rounded-lg overflow-hidden group cursor-pointer">
            <div className="aspect-square bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Stethoscope className="h-16 w-16 text-white opacity-50" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <p className="text-white font-semibold text-sm">HB1+ PHARMACY</p>
            </div>
          </div>

          {/* Department Store */}
          <div className="relative rounded-lg overflow-hidden group cursor-pointer">
            <div className="aspect-square bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <Shirt className="h-16 w-16 text-white opacity-50" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <p className="text-white font-semibold text-sm">Department Store</p>
            </div>
          </div>

          {/* Pet Supplies */}
          <div className="relative rounded-lg overflow-hidden group cursor-pointer">
            <div className="aspect-square bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <Dog className="h-16 w-16 text-white opacity-50" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <p className="text-white font-semibold text-sm">Pet Supplies</p>
            </div>
          </div>
        </div>

        {/* Menu Items by Category */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">{categories.find(c => c.id === activeCategory)?.icon || '🍽️'}</span>
            <h3 className="text-2xl font-semibold text-gray-900">
              {categories.find(c => c.id === activeCategory)?.name || 'Our Menu'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {menuItems.map((item) => {
              const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
              return (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={addToCart}
                  quantity={cartItem?.quantity || 0}
                  onUpdateQuantity={updateQuantity}
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default Menu;