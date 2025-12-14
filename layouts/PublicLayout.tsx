import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';

interface PublicLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  activePage: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children, onNavigate, activePage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'jobs', label: 'Latest Jobs' },
    { id: 'about', label: 'About' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="bg-primary-600 p-2 rounded-lg">
                <Icons.Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">GovJob<span className="text-primary-600">Portal</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    activePage === item.id 
                      ? 'text-primary-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pl-4 border-l border-slate-200">
                <Button variant="primary" size="sm" onClick={() => onNavigate('login')}>
                  Login / Signup
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-500 hover:text-slate-700"
              >
                {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 py-4 px-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                   activePage === item.id 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-100">
               <Button fullWidth variant="primary" onClick={() => onNavigate('login')}>
                  Login / Signup
                </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center mb-4">
                <div className="bg-primary-600 p-1.5 rounded-lg mr-2">
                  <Icons.Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">GovJob<span className="text-primary-500">Portal</span></span>
             </div>
             <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
               The official unified platform for government recruitment. Connecting talent with public service opportunities through a transparent, efficient, and secure process.
             </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('jobs')} className="hover:text-white transition-colors">Find Jobs</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button className="hover:text-white transition-colors">Help Center</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal & Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>support@govjobportal.example</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} GovJobPortal Enterprise. All rights reserved.
        </div>
      </footer>
    </div>
  );
};