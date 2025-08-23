import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
const Header = () => {
  return (
    <header id="header" className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Research Dashboard</h1>
                <p className="text-brand-gray">Discover profitable Amazon products with data-driven insights</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="hidden sm:block relative">
                    <input type="text" placeholder="Search products..." 
                           className="w-64 px-4 py-1 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue" />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" size="xs"/>
                </div>
                <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="User Avatar" className="w-8 h-8 rounded-full" />
            </div>
        </div>
    </header>
  );
};

export default Header;