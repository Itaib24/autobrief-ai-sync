import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Upload,
  History,
  BarChart3,
  Settings,
  Plus,
  Bug,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'New Upload', href: '/app/upload', icon: Upload },
  { name: 'History', href: '/app/history', icon: History },
  { name: 'Templates', href: '/app/templates', icon: FileText },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-20 lg:bottom-0">
      <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border overflow-y-auto">
        <div className="px-4 mb-6 mt-6">
          <Button asChild className="w-full shadow-sm">
            <Link to="/app/upload">
              <Plus className="mr-2 h-4 w-4" />
              New Brief
            </Link>
          </Button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5',
                    isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-6 pb-6">
          <div className="bg-sidebar-accent/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-sidebar-foreground mb-2">Usage This Month</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-sidebar-foreground/70">3 of 10 briefs</span>
              <span className="text-sidebar-primary font-medium">30%</span>
            </div>
            <div className="w-full bg-sidebar-accent rounded-full h-2 mt-2">
              <div className="bg-sidebar-primary h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}