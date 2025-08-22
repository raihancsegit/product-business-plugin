import React from 'react';

const Sidebar = ({ isCollapsed, onToggle, onLogout, currentView, onViewChange }) => {
  const sidebarClasses = isCollapsed ? "w-16" : "w-64";

  return (
    <aside id="sidebar" className={`bg-white border-r ${sidebarClasses} flex-shrink-0 transition-all duration-300 flex flex-col`}>
      <div id="sidebar-header" className={`flex items-center p-4 border-b ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-chart-line text-white text-sm"></i>
            </div>
            <h1 className="text-lg font-bold text-brand-blue">ProductScope Pro</h1>
          </div>
        )}
        <button onClick={onToggle} className="p-1 rounded-lg hover:bg-gray-100">
          <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-bars'} text-gray-600`}></i>
        </button>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {/* Menu Item Example */}
          <li>
            <button 
             onClick={() => onViewChange('dashboard')}
             className={`nav-item w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 ${isCollapsed ? 'justify-center' : ''} ${currentView === 'dashboard' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-home text-gray-400"></i>
              {!isCollapsed && <span className="ml-3">Dashboard</span>}
            </button>
          </li>
          {/* Add other menu items similarly */}

           <li>
                        <button 
                            onClick={() => onViewChange('favorites')}
                            className={`nav-item w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 ${isCollapsed ? 'justify-center' : ''} ${currentView === 'favorites' ? 'active' : ''}`}
                        >
                            <i className="fa-solid fa-heart text-gray-400"></i>
                            {!isCollapsed && <span className="ml-3">Favorites</span>}
                        </button>
                    </li>

                    <li>
                        <button 
                            onClick={() => onViewChange('mylist')}
                            className={`nav-item w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 ${isCollapsed ? 'justify-center' : ''} ${currentView === 'mylist' ? 'active' : ''}`}
                        >
                            <i className="fa-solid fa-bookmark text-gray-400"></i>
                            {!isCollapsed && <span className="ml-3">My List</span>}
                        </button>
                    </li>
        </ul>
      </nav>

      <div className="mt-auto">
        {!isCollapsed && (
          <div className="p-4 border-t">
            <button onClick={onLogout} className="nav-item w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
              <i className="fa-solid fa-sign-out-alt mr-3 text-red-500"></i>
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {!isCollapsed && (
          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="User Avatar" className="w-8 h-8 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Sarah Johnson</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-green-600 font-medium">Full Access</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;