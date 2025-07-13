import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Settings, LogOut, Menu, Sparkles, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  onMobileMenuClick?: () => void;
  variant?: 'app' | 'landing';
}

export function Header({ onMobileMenuClick, variant = 'app' }: HeaderProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isOnApp = location.pathname.startsWith('/app');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const Logo = () => (
    <Link to={isOnApp ? "/app" : "/"} className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-lg">
        <Sparkles className="w-5 h-5 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold text-foreground">AutoBrief.AI</span>
    </Link>
  );

  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center space-x-4">
            {variant === 'app' && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8"
                onClick={onMobileMenuClick}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Logo />
          </div>

          {/* Right side content */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {variant === 'landing' ? (
                <>
                  <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
                  <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</a>
                  <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
                  <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
                </>
              ) : null}
              
              {user && (
                isOnApp ? (
                  <Link to="/">
                    <Button variant="ghost">Main Page</Button>
                  </Link>
                ) : (
                  <Link to="/app">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                )
              )}
            </nav>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary transition-colors">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-2">
                         <Avatar className="h-8 w-8">
                           <AvatarFallback className="bg-primary/10 text-primary">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                           </AvatarFallback>
                         </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.email}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            Free Plan
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                      <Link to="/app" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/app/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className='hidden sm:flex items-center space-x-2'>
                  <Link to="/auth/login">
                      <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                      Sign In
                      </Button>
                  </Link>
                  <Link to="/auth/register">
                      <Button className="gradient-primary hover-scale shadow-elegant">
                      Start Free Trial
                      </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}