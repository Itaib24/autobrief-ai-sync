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
  X,
  Bug,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'New Upload', href: '/app/upload', icon: Upload },
  { name: 'History', href: '/app/history', icon: History },
  { name: 'Templates', href: '/app/templates', icon: FileText },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full bg-sidebar">
          <SheetHeader className="p-6 border-b border-sidebar-border">
            <SheetTitle className="text-left text-sidebar-foreground">Menu</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col flex-grow p-6">
            {/* New Brief Button */}
            <div className="mb-6">
              <Button asChild className="w-full" onClick={onClose}>
                <Link to="/app/upload">
                  <Plus className="mr-2 h-4 w-4" />
                  New Brief
                </Link>
              </Button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-primary'
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

            {/* Usage Widget */}
            <div className="mt-6 p-4 bg-sidebar-accent/50 rounded-lg">
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
      </SheetContent>
    </Sheet>
  );
}