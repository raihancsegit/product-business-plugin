import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, setItemsPerPage }) => {
    if (totalPages <= 1) {
        return null; // যদি এক পৃষ্ঠার কম ডেটা থাকে, পেজিনেশন দেখানোর দরকার নেই।
    }

    return (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center justify-center space-x-2">
                <label className="text-sm text-gray-600">Rows per page:</label>
                <select 
                    value={itemsPerPage} 
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        onPageChange(1); // Rows per page পরিবর্তন করলে প্রথম পৃষ্ঠায় যান।
                    }}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                   <option value={3}>3</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                    onClick={() => onPageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    onClick={() => onPageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};



// ProductRow নামে একটি সাব-কম্পোনেন্ট তৈরি করা হচ্ছে
const ProductRow = ({ product,favoriteIds,onToggleFavorite ,onRowClick ,selectedRowIds, onSelectionChange }) => {
  const isFavorite = favoriteIds.includes(product.id);
  const isSelected = selectedRowIds.includes(product.id);
  return (
    <tr onClick={() => onRowClick(product)} className="hover:bg-gray-50 transition-colors cursor-pointer">
      <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" className="row-checkbox rounded border-gray-300 text-brand-blue focus:ring-brand-blue" checked={isSelected}
                    onChange={() => onSelectionChange(product.id)}/>
      </td>
       <td className="px-3 py-4 text-center" onClick={(e) => {
                e.stopPropagation(); // মডাল খোলা থেকে বিরত রাখুন
                onToggleFavorite(product.id);
            }}>
              <FontAwesomeIcon 
                                                  icon={isFavorite ? faSolidHeart : faRegularHeart} 
                                                  className={`${isFavorite ? 'text-red-500' : 'text-gray-400'} cursor-pointer hover:text-red-500`} 
                                                  />
            </td>
      <td className="px-4 py-4" style={{ width: '500px' }}>
        <div className="flex items-center space-x-3">
          <img className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0" src={product.image_url} alt={product.product_title} />
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="text-sm font-medium text-gray-900 truncate">{product.product_title}</div>
            <div className="text-xs text-gray-500 truncate">{product.product_subtitle || 'N/A'}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-sm font-medium text-gray-900">${product.price || 'N/A'}</td>
      <td className="px-3 py-4 text-sm text-gray-900">{product.reviews_count || 'N/A'}</td>
      <td className="px-3 py-4 text-sm font-medium text-gray-900">{product.rating || 'N/A'}</td>
      <td className="px-3 py-4 text-sm text-gray-900">{product.monthly_sales || 'N/A'}</td>
      <td className="px-3 py-4 text-sm text-gray-900">{product.category || 'N/A'}</td>
      <td className="px-3 py-4 text-sm text-gray-900">{product.subcategory || 'N/A'}</td>
      {/* যেহেতু API রোল অনুযায়ী কলাম কম-বেশি পাঠাবে, তাই আমাদের কন্ডিশনালি রেন্ডার করতে হবে */}
      {product.sales_trend_90d && <td className="px-3 py-4 text-sm">{product.sales_trend_90d}</td>}
      {product.last_year_sales && <td className="px-3 py-4 text-sm text-gray-900">{product.last_year_sales}</td>}
      {product.yoy_sales_percent && <td className="px-3 py-4 text-sm text-gray-900">{product.yoy_sales_percent}</td>}
      {product.dimensions && <td className="px-3 py-4 text-sm text-gray-900">{product.dimensions}</td>}
      {product.weight_lbs && <td className="px-3 py-4 text-sm text-gray-900">{product.weight_lbs} lbs</td>}
      {product.age_months && <td className="px-3 py-4 text-sm text-gray-900">{product.age_months}</td>}
    </tr>
  );
};



// মূল ProductTable কম্পোনেন্ট
const ProductTable = ({  products, isLoading, error, onRowClick,favoriteIds, onToggleFavorite, currentPage, totalPages, onPageChange, itemsPerPage, setItemsPerPage,selectedRowIds, onSelectionChange }) => {
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="15" className="text-center p-8">Loading products...</td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan="15" className="text-center p-8 text-red-600">{error}</td>
        </tr>
      );
    }
    if (products.length === 0) {
      return (
        <tr>
          <td colSpan="15" className="text-center p-8">No products found.</td>
        </tr>
      );
    }
    return products.map(product => <ProductRow key={product.id} product={product} onRowClick={onRowClick} favoriteIds={favoriteIds}
                onToggleFavorite={onToggleFavorite} selectedRowIds={selectedRowIds}
                onSelectionChange={onSelectionChange}/>);
  };
  
  // যেহেতু সব ইউজার সব কলাম দেখতে পাবে না, আমাদের হেডারটিও ডাইনামিক করতে হবে।
  // আপাতত আমরা সবগুলো হেডার রেখে দিচ্ছি।
  const showAdvancedHeaders = products.length > 0 && products[0].hasOwnProperty('last_year_sales');

  return (
    <div id="product-data-section" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex justify-between items-center border-b border-gray-200">
            {/* ... tab button HTML ... */}
        </div>

        <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 resizable-table" style={{ tableLayout: 'fixed' }}>
                <thead className="bg-gray-50">
                    <tr>
                        <th style={{ width: '60px' }} className="px-3 py-3"><input type="checkbox" /></th>
                         <th style={{ width: '50px' }} className="px-3 py-3"></th>
                        <th style={{ width: '500px' }} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th style={{ width: '100px' }} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th style={{ width: '100px' }} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviews</th>
                        <th style={{ width: '80px' }} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                        <th style={{ width: '100px' }} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                        <th style={{ width: '120px' }} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th style={{ width: '140px' }} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subcategory</th>
                        {/* অ্যাডভান্সড হেডারগুলো শর্তসাপেক্ষে দেখানো যেতে পারে */}
                        {showAdvancedHeaders && (
                          <>
                            <th style={{ width: '130px' }} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Trend</th>
                            <th style={{ width: '120px' }} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Year Sales</th>
                            {/* ... باقي হেডার */}
                          </>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {renderTableContent()}
                </tbody>
            </table>
        </div>
        
        {/* Pagination */}
       
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}

            />
        
    </div>
  );
};

export default ProductTable;