import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
const ProductModal = ({ product, onClose,isFavorite, onToggleFavorite }) => {
    if (!product) return null;

    return (
        <div 
            id="product-modal" 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose} // >> পরিবর্তন: মডালের বাইরে ক্লিক করলে বন্ধ হবে
        >
            <div 
                className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // >> পরিবর্তন: মডালের ভেতরে ক্লিক করলে বন্ধ হবে না
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => onToggleFavorite(product.id)}
                                className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                            >
                                <FontAwesomeIcon 
                                    icon={isFavorite ? faSolidHeart : faRegularHeart} 
                                    className={`${isFavorite ? 'text-red-500' : 'text-gray-400'} cursor-pointer hover:text-red-500`} 
                                     size="xs"
                                    />
                            </button>
                           <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <img 
                                id="modal-product-image" 
                                className="w-full h-80 object-contain rounded-lg border mb-4" 
                                src={product.image_url} 
                                alt={product.product_title} 
                            />
                            <a href={`https://www.amazon.com/dp/${product.asin}`} target="_blank" rel="noopener noreferrer" className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-600 flex items-center justify-center">
                                <i className="fa-brands fa-amazon mr-2"></i>
                                View Product on Amazon
                            </a>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-4">{product.product_title}</h4>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">Price:</span>
                                            <span className="text-lg font-bold text-brand-blue ml-2">${product.price || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Sales:</span>
                                            <span className="font-semibold ml-2">{product.monthly_sales?.toLocaleString() || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Rating:</span>
                                            <span className="font-semibold ml-2">{product.rating || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Reviews:</span>
                                            <span className="font-semibold ml-2">{product.reviews_count?.toLocaleString() || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Advanced Data Section */}
                                {product.last_year_sales && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-600">Sales Trend:</span>
                                                <div className="mt-1">{product.sales_trend_90d || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Last Year Sales:</span>
                                                <span className="font-semibold ml-2">{product.last_year_sales?.toLocaleString() || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Age:</span>
                                                <span className="font-semibold ml-2">{product.age_months || 'N/A'} months</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;