import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { navItems } from '@/nav-items';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const Navigation = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-white font-bold text-xl">
            VeegoxChain
          </Link>
          
          {/* Main Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link key={item.title} to={item.to} className="text-gray-300 hover:text-white">
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu className="h-6 w-6 text-white" />
            </SheetTrigger>
            <SheetContent side="left" className="bg-gray-900 text-white">
              <SheetHeader>
                <SheetTitle>VeegoxChain</SheetTitle>
                <SheetDescription>
                  Navigation
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                {navItems.map((item) => (
                  <Link key={item.title} to={item.to} className="block py-2 text-gray-300 hover:text-white">
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400">
                  {user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                  className="border-gray-600 hover:bg-gray-700"
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Se connecter
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
