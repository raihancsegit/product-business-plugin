import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FilterControls from './components/FilterControls';
import ProductTable from './components/ProductTable';
import Login from './components/Login';
import ProductModal from './components/ProductModal';
import FavoritesPage from './components/FavoritesPage'; 
import MyListPage from './components/MyListPage'; 
const API_URL = 'http://wp2025.local/wp-json/productscope/v1/products';
const FAVORITES_API_URL = 'http://wp2025.local/wp-json/productscope/v1/favorites';
const MYLIST_API_URL = 'http://wp2025.local/wp-json/productscope/v1/mylist';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

   const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
  
  // ফিল্টার এবং সাইডবারের জন্য নতুন স্টেট
  const [filters, setFilters] = useState({});
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

   const [selectedProduct, setSelectedProduct] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState([]);

   const [currentView, setCurrentView] = useState('dashboard'); 

   const [selectedRowIds, setSelectedRowIds] = useState([]);

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

  const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null); // মডাল বন্ধ হলে সিলেক্ট করা প্রোডাক্ট রিসেট করুন
    };

  const handleLoginSuccess = () => {
    setToken(localStorage.getItem('authToken'));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prevState => !prevState);
  };

  const handleFilterChange = (newFilters) => {
    // শুধুমাত্র ভ্যালু আছে এমন ফিল্টারগুলো পাঠানো হবে
    const activeFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, value]) => value !== '')
    );
    setFilters(activeFilters);
    setSelectedRowIds([]);
    setCurrentPage(1);
  };

    const handleAddToList = async () => {
        if (selectedRowIds.length === 0) {
            alert("Please select products to add to your list.");
            return;
        }

        try {
            const response = await axios.post(`${MYLIST_API_URL}/add`, 
                { product_ids: selectedRowIds },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert(response.data.message); // সফল হলে মেসেজ দেখানো
            setSelectedRowIds([]); // সিলেকশন রিসেট করা
        } catch (err) {
            alert("Failed to add products to your list.");
            console.error("Add to list error:", err);
        }
    };

    const handleRowSelectionChange = (productId) => {
        setSelectedRowIds(prev => 
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setProducts([]); // লগআউট করলে প্রোডাক্ট তালিকা খালি করে দেওয়া
      setTotalPages(0);
      setFavoriteIds([]);
      return;
    }

    const fetchInitialData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // ১. প্রথমে ফেভারিট তালিকা লোড করুন
            const favResponse = await axios.get(FAVORITES_API_URL, { // << **পরিবর্তন:** '/toggle' বাদ দেওয়া হয়েছে
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // API থেকে {products: [...]} অবজেক্ট আসছে
            const favIds = favResponse.data.products.map(p => p.id);
            setFavoriteIds(favIds); // << **গুরুত্বপূর্ণ:** নিশ্চিত করুন যে এটি সঠিকভাবে আইডি অ্যারে সেট করছে

            // ২. এরপর প্রোডাক্ট তালিকা লোড করুন
            const params = new URLSearchParams({
                ...filters,
                page: currentPage,
                per_page: itemsPerPage,
            }).toString();
            
            const prodResponse = await axios.get(`${API_URL}?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setProducts(prodResponse.data.products || []);
            setTotalPages(prodResponse.data.totalPages || 0);

        }  catch (err) {
            if (err.response && err.response.status === 403) {
                handleLogout();
            } else {
                setError("Failed to fetch data. Please try again.");
            }
            console.error("API Error:", err);
            setProducts([]);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    };

    fetchInitialData();

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
                    ...filters,
                    page: currentPage,
                    per_page: itemsPerPage,
                }).toString();
        const response = await axios.get(`${API_URL}?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 0);
      } catch (err) {
        if (err.response && err.response.status === 403) {
            handleLogout();
        } else {
            setError("Failed to fetch products. Please try again.");
        }
        console.error("API Error:", err);
        setProducts([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [token, filters, currentPage, itemsPerPage, currentView]);


  const handleToggleFavorite = async (productId) => {
        const isCurrentlyFavorite = favoriteIds.includes(productId);

        // UI-তে সাথে সাথে পরিবর্তন দেখানোর জন্য (Optimistic Update)
        if (isCurrentlyFavorite) {
            setFavoriteIds(prev => prev.filter(id => id !== productId));
        } else {
            setFavoriteIds(prev => [...prev, productId]);
        }

        try {
            await axios.post(`${FAVORITES_API_URL}/toggle`, 
                { product_id: productId }, 
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            // সফল হলে কিছু করার দরকার নেই, কারণ UI আগেই আপডেট হয়ে গেছে
        } catch (err) {
            console.error("Failed to update favorite status:", err);
            // যদি API কলে এরর হয়, তাহলে UI-কে আগের অবস্থায় ফিরিয়ে আনা
            if (isCurrentlyFavorite) {
                setFavoriteIds(prev => [...prev, productId]);
            } else {
                setFavoriteIds(prev => prev.filter(id => id !== productId));
            }
        }
    };

  const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div id="app" className="font-inter bg-brand-light flex h-screen">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
        onLogout={handleLogout}
        currentView={currentView} 
        onViewChange={handleViewChange}  
      />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
             {currentView === 'dashboard' && (
                            <>
                 <FilterControls onFilterChange={handleFilterChange} onAddToList={handleAddToList}  isAddToListDisabled={selectedRowIds.length === 0}/>
                    <ProductTable 
                      products={products} 
                      isLoading={isLoading}
                      error={error}
                      currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        onRowClick={handleOpenModal}
                        favoriteIds={favoriteIds} 
                        onToggleFavorite={handleToggleFavorite} 
                        selectedRowIds={selectedRowIds}
                        onSelectionChange={handleRowSelectionChange}
                    />
                  </>
                  )}

                  {currentView === 'favorites' && (
                            <FavoritesPage
                                token={token} // favorites পেজকে API কল করার জন্য টোকেন লাগবে
                                favoriteIds={favoriteIds}
                                onToggleFavorite={handleToggleFavorite}
                                onRowClick={handleOpenModal}
                            />
                        )}

                        {currentView === 'mylist' && (
                            <MyListPage
                                token={token}
                                onRowClick={handleOpenModal}
                                onToggleFavorite={handleToggleFavorite}
                                favoriteIds={favoriteIds}
                            />
                        )}
          </div>
        </div>
      </main>
      {isModalOpen && (
                <ProductModal 
                    product={selectedProduct} 
                    onClose={handleCloseModal} 
                    isFavorite={favoriteIds.includes(selectedProduct?.id)} // << এটি ঠিক আছে, কিন্তু কখন কল হচ্ছে তার উপর নির্ভরশীল
                    onToggleFavorite={handleToggleFavorite}
                />
            )}
    </div>
  );
}

export default App;