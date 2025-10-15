import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import Header from './components/Header';
import CategorySidebar from './components/CategorySidebar';
import MobileMenu from './components/MobileMenu';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import FloatingCartButton from './components/FloatingCartButton';
import AdminDashboard from './components/AdminDashboard';
import { useMenu } from './hooks/useMenu';
import { useCategories } from './hooks/useCategories';

function MainApp() {
  const cart = useCart();
  const { menuItems } = useMenu();
  const { categories } = useCategories();
  const [currentView, setCurrentView] = React.useState<'menu' | 'cart' | 'checkout'>('menu');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState<boolean>(false);

  const handleViewChange = (view: 'menu' | 'cart' | 'checkout') => {
    setCurrentView(view);
    setIsMobileMenuOpen(false); // Close mobile menu when changing views
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Clear the flag when a specific category is selected
    sessionStorage.removeItem('explicitlyChoseAll');
  };

  const handleViewAllCategories = () => {
    setSelectedCategory('all');
    // Mark that user explicitly chose 'all' to prevent useEffect from overriding
    sessionStorage.setItem('explicitlyChoseAll', 'true');
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setIsMobileMenuOpen(false);
    
    // Mark that user explicitly chose 'all' to prevent useEffect from overriding
    sessionStorage.setItem('explicitlyChoseAll', 'true');
    
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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // When searching, show all categories to display search results
    if (term.trim()) {
      setSelectedCategory('all');
    } else {
      // If search is cleared, go back to first category if we're on 'all'
      if (selectedCategory === 'all' && categories.length > 0) {
        setSelectedCategory(categories[0].id);
      }
    }
  };

  // Set default category only when no search term and categories are loaded
  // But don't override if user explicitly selected 'all'
  React.useEffect(() => {
    if (categories.length > 0 && selectedCategory === 'all' && !searchTerm.trim()) {
      // Only set to first category if we haven't explicitly chosen 'all'
      // This prevents overriding when user clicks logo to show all products
      const hasExplicitlyChosenAll = sessionStorage.getItem('explicitlyChoseAll') === 'true';
      if (!hasExplicitlyChosenAll) {
        setSelectedCategory(categories[0].id);
      }
    }
  }, [categories, selectedCategory, searchTerm]);

  // Filter products based on selected category and search term
  let filteredMenuItems = menuItems;
  
  // First apply category filter (unless "all" is selected)
  if (selectedCategory !== 'all') {
    filteredMenuItems = menuItems.filter(item => item.category === selectedCategory);
  }
  
  // Then apply search filter if search term exists
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filteredMenuItems = filteredMenuItems.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={cart.getTotalItems()}
        onCartClick={() => handleViewChange('cart')}
        onMenuClick={handleMobileMenuToggle}
        onLogoClick={handleLogoClick}
        onSearch={handleSearch}
      />
      
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
        onViewAllCategories={handleViewAllCategories}
      />

      <div className="flex">
        {/* Category Sidebar - Hidden on mobile */}
        {currentView === 'menu' && (
          <div className="hidden lg:block">
            <CategorySidebar 
              selectedCategory={selectedCategory} 
              onCategoryClick={handleCategoryClick}
              onViewAllCategories={handleViewAllCategories}
            />
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {currentView === 'menu' && (
            <Menu 
              menuItems={filteredMenuItems}
              addToCart={cart.addToCart}
              cartItems={cart.cartItems}
              updateQuantity={cart.updateQuantity}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              onCategoryClick={handleCategoryClick}
            />
          )}
          
          {currentView === 'cart' && (
            <Cart 
              cartItems={cart.cartItems}
              updateQuantity={cart.updateQuantity}
              removeFromCart={cart.removeFromCart}
              clearCart={cart.clearCart}
              getTotalPrice={cart.getTotalPrice}
              onContinueShopping={() => handleViewChange('menu')}
              onCheckout={() => handleViewChange('checkout')}
            />
          )}
          
          {currentView === 'checkout' && (
            <Checkout 
              cartItems={cart.cartItems}
              totalPrice={cart.getTotalPrice()}
              onBack={() => handleViewChange('cart')}
            />
          )}
        </main>
      </div>
      
      {currentView === 'menu' && (
        <FloatingCartButton 
          itemCount={cart.getTotalItems()}
          onCartClick={() => handleViewChange('cart')}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;