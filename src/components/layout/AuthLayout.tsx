import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center bg-background text-foreground p-4 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
      </div>
      
      <Header />

      <main className="w-full max-w-md my-auto">
        <Outlet />
      </main>
    </div>
  );
}