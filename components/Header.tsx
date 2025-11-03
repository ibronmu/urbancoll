'use client';

import { useState } from 'react';
import { CartItem } from '@/lib/types';

interface HeaderProps {
  cart?: CartItem[];
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onCartClick?: () => void;
  totalItems?: number;
}

export default function Header({ 
  cart = [], 
  searchQuery = '', 
  setSearchQuery = () => {},
  onCartClick = () => {},
  totalItems = 0 
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">UC</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">UrbanColl</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-primary-600 font-medium">Home</a>
            <a href="/#products" className="text-gray-700 hover:text-primary-600 font-medium">Products</a>
            <a href="/vendors" className="text-gray-700 hover:text-primary-600 font-medium">Vendors</a>
            <a href="/#about" className="text-gray-700 hover:text-primary-600 font-medium">About</a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Cart & Auth */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-primary-600"
            >
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            
            <a href="/admin" className="btn-secondary hidden md:flex items-center">
              <span className="mr-2">👤</span>
              Admin
            </a>
            
            <a href="/vendors" className="btn-primary hidden md:flex">Become a Vendor</a>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <a href="/" className="block py-2 text-gray-700">Home</a>
            <a href="/#products" className="block py-2 text-gray-700">Products</a>
            <a href="/vendors" className="block py-2 text-gray-700">Vendors</a>
            <a href="/#about" className="block py-2 text-gray-700">About</a>
            <a href="/admin" className="block py-2 text-gray-700">Admin</a>
            <a href="/vendors" className="block w-full btn-primary py-2 text-center">Become a Vendor</a>
          </div>
        </div>
      )}
    </header>
  );
}