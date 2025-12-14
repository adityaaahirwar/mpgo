import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { UserRole } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  role, 
  activePage, 
  onNavigate,
  onLogout 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Define sidebar items based on role
  const menuItems = role === 'admin' ? [
    { id: 'admin-dashboard', label: 'Overview', icon: Icons.BarChart },
    { id: 'admin-jobs', label: 'Job Management', icon: Icons.Briefcase },
    { id: 'admin-users', label: 'Users', icon: Icons.Users },
    { id: 'admin-apps', label: 'Applications', icon: Icons.FileText },
    { id: 'admin-settings', label: 'System Settings', icon: Icons.Settings },
  ] : [
    { id: 'user-dashboard', label: 'Overview', icon: Icons.Home },
    { id: 'user-jobs', label: 'Browse Jobs', icon: Icons.Search },
    { id: 'user-apps', label: 'My Applications', icon: Icons.FileText },
    { id: 'user-profile', label: 'Profile', icon: Icons.Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'w-64' : 'w-20'} fixed h-full z-30`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
           {sidebarOpen ? (
             <span className="text-xl font-bold text-white">Gov<span className="text-primary-500">Admin</span></span>
           ) : (
             <span className="text-xl font-bold text-primary-500">G</span>
           )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors group
                ${activePage === item.id 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'}`}
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon className={`w-5 h-5 ${!sidebarOpen ? 'mx-auto' : 'mr-3'}`} />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={onLogout}
             className={`w-full flex items-center text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-2 rounded-lg transition-colors
               ${!sidebarOpen ? 'justify-center' : ''}`}
            >
             <Icons.LogOut className="w-5 h-5" />
             {sidebarOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-20 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-500 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100"
            >
              <Icons.Menu className="w-6 h-6" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-slate-800 capitalize">
              {activePage.replace('-', ' ').replace('admin', '').replace('user', '')}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Icons.Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                {role === 'admin' ? 'AD' : 'US'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-900">{role === 'admin' ? 'Administrator' : 'John Doe'}</p>
                <p className="text-xs text-slate-500 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};