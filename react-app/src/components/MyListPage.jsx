
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';

// টেবিলের প্রতিটি সারির জন্য একটি সাব-কম্পোনেন্ট
// এটি কোডকে পরিষ্কার রাখে এবং পুনঃব্যবহারযোগ্য করে তোলে
const MyListProductRow = ({ product, onRowClick}) => {
    return (
        <tr onClick={() => onRowClick(product)} className="hover:bg-gray-50 transition-colors cursor-pointer">
           
            <td className="px-4 py-4">
                <div className="flex items-center space-x-3">
                    <img 
                        className="w-12 h-12 rounded-lg object-contain border bg-white" 
                        src={product.image_url} 
                        alt={product.product_title} 
                    />
                    <div>
                        <div className="text-sm font-medium text-gray-900 truncate" style={{maxWidth: '400px'}}>
                            {product.product_title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {product.product_subtitle || 'No subtitle'}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-3 py-4 text-sm font-medium text-gray-900">${product.price}</td>
            <td className="px-3 py-4 text-sm">{product.rating}</td>
            <td className="px-3 py-4 text-sm">{product.category}</td>
            <td className="px-3 py-4 text-sm">{product.monthly_sales?.toLocaleString()}</td>
        </tr>
    );
};


const MyListPage = ({ myListProducts, onRowClick }) => {
  
    // কন্টেন্ট রেন্ডার করার জন্য একটি হেল্পার ফাংশন
    const renderContent = () => {
       
        if (myListProducts.length === 0) {
            return <p className="text-center p-8 text-gray-500">Your list is empty. Add products from the dashboard to see them here.</p>;
        }

        return (
            <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                           
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {myListProducts.map(product => (
                            <MyListProductRow
                                key={product.id}
                                product={product}
                                onRowClick={onRowClick}
                               
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Saved List</h2>
            {renderContent()}
        </div>
    );
};

export default MyListPage;