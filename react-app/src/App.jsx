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
import useFullscreenMode from './hooks/useFullscreenMode';
import { PRODUCTS_API_URL, FAVORITES_API_URL,MYLIST_API_URL } from './config';

function App() {
   useFullscreenMode();
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

   const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [userRole, setUserRole] = useState(''); 
    const [totalUnlimited, setTotalUnlimited] = useState(0); 
    const [userDisplayName, setUserDisplayName] = useState(localStorage.getItem('userDisplayName') || '');
  
  // ফিল্টার এবং সাইডবারের জন্য নতুন স্টেট
  const [filters, setFilters] = useState({});
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);



   const [selectedProduct, setSelectedProduct] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState([]);
const [favoriteProducts, setFavoriteProducts] = useState([]);
   const [currentView, setCurrentView] = useState('dashboard'); 

   const [selectedRowIds, setSelectedRowIds] = useState([]);
     const [myListProducts, setMyListProducts] = useState([]);

     const [searchQuery, setSearchQuery] = useState('');

   useEffect(() => {
        // কম্পোনেন্ট মাউন্ট হলে body-তে ক্লাস যোগ করুন
        document.body.classList.add('psp-dashboard-active');

        // কম্পোনেন্ট আনমাউন্ট হলে (যেমন অন্য পেজে গেলে) ক্লাসটি মুছে ফেলুন
        return () => {
            document.body.classList.remove('psp-dashboard-active');
        };
    }, []);

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
    setUserDisplayName(localStorage.getItem('userDisplayName') || '');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
     localStorage.removeItem('userDisplayName');
    setToken(null);
    setUserDisplayName('');
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

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // সার্চ করলে প্রথম পৃষ্ঠায় ফিরে যান
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
            fetchMyListData();
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
            
            const favResponse = await axios.get(FAVORITES_API_URL, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (favResponse.data && favResponse.data.products) {
              const favProducts = favResponse.data.products;
              setFavoriteProducts(favProducts); // << এই লাইনটি যোগ করা হয়েছে
              setFavoriteIds(favProducts.map(p => p.id));
            }
            // ২. এরপর প্রোডাক্ট তালিকা লোড করুন
            const params = new URLSearchParams({
                ...filters,
                page: currentPage,
                per_page: itemsPerPage,
                search: searchQuery,
            }).toString();
            
            const prodResponse = await axios.get(`${PRODUCTS_API_URL}?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setProducts(prodResponse.data.products || []);
            setTotalPages(prodResponse.data.totalPages || 0);
            setUserRole(prodResponse.data?.user_role || '');
            setTotalUnlimited(prodResponse.data?.total_unlimited || 0);

        }  catch (err) {
            if (err.response && err.response.status === 403) {
                handleLogout();
            } else {
                setError("Failed to fetch data. Please try again.");
            }
            console.error("API Error:", err);
            setProducts([]);
            setTotalPages(0);
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
        const response = await axios.get(`${PRODUCTS_API_URL}?${params}`, {
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

        const fetchMyListData = async () => {
        try {
            const myListResponse = await axios.get(MYLIST_API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (myListResponse.data && myListResponse.data.products) {
                setMyListProducts(myListResponse.data.products);
            }
        } catch (err) {
            console.error("Failed to fetch My List:", err);
        }
    };

    fetchMyListData();

  }, [token, filters, currentPage, itemsPerPage, currentView,searchQuery]);


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

            const favResponse = await axios.get(FAVORITES_API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
            if (favResponse.data && favResponse.data.products) setFavoriteProducts(favResponse.data.products);
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
        userDisplayName={userDisplayName} // << নতুন prop
        userRole={userRole} 
      />
      <main className="flex-1 overflow-auto">
        <Header 
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
          userDisplayName={userDisplayName}
        />
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
                        userRole={userRole}
                         totalProducts={products.length}  
                        totalUnlimited={totalUnlimited}
                    />
                  </>
                  )}

                  {currentView === 'favorites' && (
                             <FavoritesPage
                                favoriteProducts={favoriteProducts} // << নতুন prop যোগ করা হয়েছে
                                token={token} // এটি আর প্রয়োজন নেই, কিন্তু রাখলেও সমস্যা নেই
                                favoriteIds={favoriteIds}
                                onToggleFavorite={handleToggleFavorite}
                                onRowClick={handleOpenModal}
                            />
                        )}

                        {currentView === 'mylist' && (
                            <MyListPage
                                myListProducts={myListProducts}
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