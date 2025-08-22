import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus,faChevronDown  } from '@fortawesome/free-solid-svg-icons';
// ক্যাটাগরি এবং সাব-ক্যাটাগরির সম্পূর্ণ ডেটা, যা আপনার HTML থেকে নেওয়া হয়েছে
const categoriesData = [
    {
        name: "Electronics",
        items: [
            { label: "Electronics (All)", value: "Electronics" },
            { label: "Smartphones & Accessories", value: "Smartphones & Accessories", isSub: true },
            { label: "Computers & Tablets", value: "Computers & Tablets", isSub: true },
            { label: "Audio & Headphones", value: "Audio & Headphones", isSub: true },
            { label: "Cameras & Photo", value: "Cameras & Photo", isSub: true },
            { label: "Gaming & Consoles", value: "Gaming & Consoles", isSub: true },
        ]
    },
    {
        name: "Home & Kitchen",
        items: [
            { label: "Home & Kitchen (All)", value: "Home & Kitchen" },
            { label: "Kitchen Appliances", value: "Kitchen Appliances", isSub: true },
            { label: "Cookware & Bakeware", value: "Cookware & Bakeware", isSub: true },
            { label: "Furniture & Decor", value: "Furniture & Decor", isSub: true },
            { label: "Bedding & Bath", value: "Bedding & Bath", isSub: true },
            { label: "Storage & Organization", value: "Storage & Organization", isSub: true },
        ]
    },
    {
        name: "Sports & Outdoors",
        items: [
            { label: "Sports & Outdoors (All)", value: "Sports & Outdoors" },
            { label: "Fitness & Exercise", value: "Fitness & Exercise", isSub: true },
            { label: "Outdoor Recreation", value: "Outdoor Recreation", isSub: true },
            { label: "Team Sports", value: "Team Sports", isSub: true },
            { label: "Water Sports", value: "Water Sports", isSub: true },
            { label: "Winter Sports", value: "Winter Sports", isSub: true },
        ]
    },
    // আপনি এখানে আপনার HTML থেকে বাকি সব ক্যাটাগরি গ্রুপ একইভাবে যুক্ত করতে পারেন
];

const FilterControls = ({ onFilterChange,onAddToList, isAddToListDisabled }) => {
    // সব ফিল্টারের জন্য একটি মাত্র স্টেট অবজেক্ট
    const [filters, setFilters] = useState({
        categories: [],
        minPrice: '', maxPrice: '',
        minSales: '', maxSales: '',
        minWeight: '', maxWeight: '',
        minAge: '', maxAge: ''
    });

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // DOM এলিমেন্ট রেফারেন্স করার জন্য

    // কাস্টম হুক: কম্পোনেন্টের বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করার জন্য
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    // যেকোনো ইনপুট ফিল্ড পরিবর্তনের জন্য একটি জেনেরিক হ্যান্ডলার
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // ক্যাটাগরি চেকবক্স সিলেক্ট বা ডি-সিলেক্ট করার হ্যান্ডলার
    const handleCategoryToggle = (value) => {
        setFilters(prev => {
            const newCategories = prev.categories.includes(value)
                ? prev.categories.filter(item => item !== value)
                : [...prev.categories, value];
            return { ...prev, categories: newCategories };
        });
    };
    
    // "Apply Filters" বাটনে ক্লিক করলে মূল App কম্পোনেন্টকে জানানো
    const handleApplyFilters = () => {
        const filterPayload = { ...filters, categories: filters.categories.join(',') };
        onFilterChange(filterPayload);
    };

    // সিলেক্ট করা ভ্যালু থেকে লেবেল খুঁজে বের করার জন্য একটি হেল্পার ফাংশন
    const getLabelByValue = (value) => {
        for (const group of categoriesData) {
            const item = group.items.find(i => i.value === value);
            if (item) return item.label;
        }
        return value; // যদি না পাওয়া যায়, ভ্যালুটিই দেখানো হবে
    };

    return (
        <div id="dashboard-controls" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                   <FontAwesomeIcon icon={faFilter} className="mr-2 text-brand-blue" />
                    Filters &amp; Controls
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    
                    {/* Category Multi-Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <div className="multi-select" ref={dropdownRef}>
                            <div className="multi-select-trigger" onClick={() => setDropdownOpen(prev => !prev)}>
                                <div className="multi-select-tags">
                                    {filters.categories.length === 0 ? (
                                        <span className="multi-select-placeholder">Select categories...</span>
                                    ) : (
                                        filters.categories.map(value => (
                                            <span key={value} className="multi-select-tag">
                                                {getLabelByValue(value)}
                                                <span 
                                                    className="multi-select-tag-remove" 
                                                    onClick={(e) => { e.stopPropagation(); handleCategoryToggle(value); }}
                                                >×</span>
                                            </span>
                                        ))
                                    )}
                                </div>
                               <FontAwesomeIcon 
                                    icon={faChevronDown} 
                                    className={`multi-select-chevron text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                />
                            </div>
                            {isDropdownOpen && (
                                <div className="multi-select-content open">
                                    {categoriesData.map(group => (
                                        <React.Fragment key={group.name}>
                                            <div className="multi-select-group">{group.name}</div>
                                            {group.items.map(item => (
                                                <div 
                                                    key={item.value} 
                                                    className={`multi-select-item ${item.isSub ? 'multi-select-subcategory' : ''} ${filters.categories.includes(item.value) ? 'selected' : ''}`}
                                                    onClick={() => handleCategoryToggle(item.value)}
                                                >
                                                    <input type="checkbox" className="multi-select-checkbox" checked={filters.categories.includes(item.value)} readOnly />
                                                    <span>{item.label}</span>
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Other Filters */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range ($)</label>
                        <div className="flex space-x-2">
                            <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                            <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sales Range</label>
                        <div className="flex space-x-2">
                             <input type="number" name="minSales" placeholder="Min" value={filters.minSales} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                             <input type="number" name="maxSales" placeholder="Max" value={filters.maxSales} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight Range (lbs)</label>
                        <div className="flex space-x-2">
                            <input type="number" name="minWeight" placeholder="Min" value={filters.minWeight} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" step="0.1" />
                            <input type="number" name="maxWeight" placeholder="Max" value={filters.maxWeight} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" step="0.1" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age Range (Months)</label>
                        <div className="flex space-x-2">
                            <input type="number" name="minAge" placeholder="Min" value={filters.minAge} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                            <input type="number" name="maxAge" placeholder="Max" value={filters.maxAge} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleApplyFilters}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                         <FontAwesomeIcon icon={faFilter} className="mr-2" />
                        Apply Filters
                    </button>
                </div>
                <div className="flex items-center space-x-3">
                    <button 
                        id="bulk-add-btn" 
                        onClick={onAddToList}
                        disabled={isAddToListDisabled}
                        className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add Selected to List
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterControls;