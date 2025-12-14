import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { Jobs } from './pages/public/Jobs';
import { Login } from './pages/public/Login';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { MyApplications } from './pages/user/MyApplications';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { JobManager } from './pages/admin/JobManager';

const App: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Route Protection Logic
  useEffect(() => {
    if (user) {
      if (role === 'admin') {
        // If on a public page or login, redirect to admin dashboard
        if (['home', 'jobs', 'about', 'login'].includes(currentPage)) {
          setCurrentPage('admin-dashboard');
        }
      } else if (role === 'user') {
        // If on login page, redirect to user dashboard
        if (currentPage === 'login') {
          setCurrentPage('user-dashboard');
        }
      }
    } else {
      // If not logged in, restrict access to protected pages
      if (currentPage.startsWith('admin-') || currentPage.startsWith('user-')) {
        setCurrentPage('login');
      }
    }
  }, [user, role, currentPage]);

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // ---------------------------------------------------------------------------
  // ROUTING LOGIC
  // ---------------------------------------------------------------------------

  // PUBLIC VIEWS
  if (!user || (role === 'user' && !currentPage.startsWith('user-'))) {
    // Note: Allow logged-in users to see public pages if they navigate there explicitly, 
    // but default dashboard layout takes precedence for 'user-' routes.
    
    // However, for this simple router, if a user is logged in but the page is public:
    if (['home', 'jobs', 'about', 'login'].includes(currentPage)) {
       if (currentPage === 'login' && user) return null; // Should have redirected

       let content;
       switch (currentPage) {
         case 'home': content = <Home onNavigate={navigate} />; break;
         case 'jobs': content = <Jobs />; break;
         case 'about': content = <div className="p-20 text-center"><h1 className="text-4xl font-bold">About Page Placeholder</h1></div>; break;
         case 'login': return <Login onLogin={() => {}} />; // Callback handled inside Login component via auth
         default: content = <Home onNavigate={navigate} />;
       }

       return (
         <PublicLayout activePage={currentPage} onNavigate={navigate}>
           {content}
         </PublicLayout>
       );
    }
  }

  // AUTHENTICATED VIEWS
  let dashboardContent;
  
  if (role === 'admin') {
    switch (currentPage) {
      case 'admin-dashboard': dashboardContent = <AdminDashboard />; break;
      case 'admin-jobs': dashboardContent = <JobManager />; break;
      case 'admin-users': dashboardContent = <div className="p-10 text-center text-slate-500">User Management Table Placeholder</div>; break;
      case 'admin-apps': dashboardContent = <div className="p-10 text-center text-slate-500">All Applications Overview Placeholder</div>; break;
      case 'admin-settings': dashboardContent = <div className="p-10 text-center text-slate-500">System Settings Placeholder</div>; break;
      default: dashboardContent = <AdminDashboard />;
    }
  } else {
    // User Role
    switch (currentPage) {
      case 'user-dashboard': dashboardContent = <UserDashboard />; break;
      case 'user-jobs': dashboardContent = <Jobs />; break; // Reusing public jobs list but authenticated
      case 'user-apps': dashboardContent = <MyApplications />; break;
      case 'user-profile': dashboardContent = <div className="p-10 text-center text-slate-500">User Profile Settings Placeholder</div>; break;
      default: dashboardContent = <UserDashboard />;
    }
  }

  return (
    <DashboardLayout 
      role={role} 
      activePage={currentPage} 
      onNavigate={navigate} 
      onLogout={logout}
    >
      {dashboardContent}
    </DashboardLayout>
  );
};

export default App;