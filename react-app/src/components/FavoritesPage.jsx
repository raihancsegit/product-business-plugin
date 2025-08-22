import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  FAVORITES_API_URL } from '../config';
// ফেভারিট পেজের জন্য আমরা ProductTable-এর মতো একটি টেবিল ব্যবহার করতে পারি
// কোড পুনরাবৃত্তি এড়ানোর জন্য, আমরা ProductRow কম্পোনেন্টটি এখানেও ব্যবহার করতে পারি (অথবা একটি শেয়ার্ড কম্পোনেন্ট ফোল্ডারে রাখতে পারি)
const FavoriteProductRow = ({ product, onRowClick, isFavorite, onToggleFavorite }) => {
    return (
        <tr onClick={() => onRowClick(product)} className="hover:bg-gray-50 transition-colors cursor-pointer">
            <td className="px-3 py-4 text-center" onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}>
                <i className={`${isFavorite ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart cursor-pointer hover:text-red-500`}></i>
            </td>
            <td className="px-4 py-4">
                <div className="flex items-center space-x-3">
                    <img className="w-12 h-12 rounded-lg object-cover border" src={product.image_url} alt={product.product_title} />
                    <div>
                        <div className="text-sm font-medium text-gray-900 truncate">{product.product_title}</div>
                    </div>
                </div>
            </td>
            <td className="px-3 py-4 text-sm">${product.price}</td>
            <td className="px-3 py-4 text-sm">{product.rating}</td>
            <td className="px-3 py-4 text-sm">{product.category}</td>
        </tr>
    );
};


const FavoritesPage = ({ token, favoriteIds, onToggleFavorite, onRowClick }) => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavoriteProducts = async () => {
            if (!token) return;
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(FAVORITES_API_URL, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setFavoriteProducts(response.data.products || []);
            } catch (err) {
                setError("Failed to load favorite products.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchFavoriteProducts();
    }, [token, favoriteIds]); // favoriteIds পরিবর্তন হলেও যেন তালিকা রিফ্রেশ হয়

    const renderContent = () => {
        if (isLoading) return <p className="text-center p-8">Loading favorites...</p>;
        if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
        if (favoriteProducts.length === 0) return <p className="text-center p-8">You have no favorite products yet.</p>;

        return (
            <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-3 w-16"></th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase">Product</th>
                        <th className="px-3 py-3 text-left text-xs font-medium uppercase">Price</th>
                        <th className="px-3 py-3 text-left text-xs font-medium uppercase">Rating</th>
                        <th className="px-3 py-3 text-left text-xs font-medium uppercase">Category</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y">
                    {favoriteProducts.map(product => (
                        <FavoriteProductRow
                            key={product.id}
                            product={product}
                            onRowClick={onRowClick}
                            isFavorite={favoriteIds.includes(product.id)}
                            onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Favorites</h2>
            <div className="overflow-x-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default FavoritesPage;