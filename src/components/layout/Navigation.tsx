
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Products', href: '/products' },
    { label: 'Tokens', href: '/tokens' },
    { label: 'Governance', href: '/governance' },
    { label: 'Blog', href: '/blog' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 w-full z-50 veegox-glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 veegox-gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg sm:text-xl">V</span>
            </div>
            <span className="text-white text-xl sm:text-2xl font-bold tracking-tight hidden xs:block">VEEGOX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm font-semibold transition-all duration-300 hover:text-white relative group ${
                  isActive(item.href) ? 'text-white' : 'text-gray-300'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 veegox-gradient-primary transition-all duration-300 group-hover:w-full ${
                  isActive(item.href) ? 'w-full' : ''
                }`} />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link to="/dashboard">
              <Button className="veegox-button-secondary text-sm">
                Dashboard
              </Button>
            </Link>
            <Button className="veegox-button-primary text-sm">
              Connect Wallet
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10 p-2"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 sm:py-6 border-t border-white/10 animate-fade-in-up">
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-base sm:text-lg font-semibold transition-colors hover:text-white px-2 py-1 ${
                    isActive(item.href) ? 'text-white' : 'text-gray-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full veegox-button-secondary">
                    Dashboard
                  </Button>
                </Link>
                <Button className="w-full veegox-button-primary">
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
