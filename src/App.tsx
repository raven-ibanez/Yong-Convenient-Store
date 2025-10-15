import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import Header from './components/Header';
import CategorySidebar from './components/CategorySidebar';
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

  const handleViewChange = (view: 'menu' | 'cart' | 'checkout') => {
    setCurrentView(view);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Set default category
  React.useEffect(() => {
    if (categories.length > 0 && selectedCategory === 'all') {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Filter menu items based on selected category
  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={cart.getTotalItems()}
        onCartClick={() => handleViewChange('cart')}
        onMenuClick={() => handleViewChange('menu')}
      />
      
      <div className="flex">
        {/* Category Sidebar */}
        {currentView === 'menu' && (
          <CategorySidebar 
            selectedCategory={selectedCategory} 
            onCategoryClick={handleCategoryClick} 
          />
        )}
        
        {/* Main Content */}
        <main className="flex-1">
          {currentView === 'menu' && (
            <Menu 
              menuItems={filteredMenuItems}
              addToCart={cart.addToCart}
              cartItems={cart.cartItems}
              updateQuantity={cart.updateQuantity}
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