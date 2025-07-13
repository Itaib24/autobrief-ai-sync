import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';

export function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMobileMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />
      
      {/* Mobile sidebar overlay */}
      <MobileSidebar 
        open={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />
      
      <div className="flex">
        {/* Desktop sidebar */}
        <Sidebar />
        
        {/* Main content with responsive padding */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:pl-72">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}