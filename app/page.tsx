'use client';

import { useState } from 'react';

// Simple types
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  vendor: string;
  description: string;
  image: string;
  featured: boolean;
  rating: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// Sample data
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "HP Laptop 15.6inch",
    price: 250000,
    category: "Electronics",
    vendor: "TechHub NG",
    description: "Brand new HP laptop with 8GB RAM, 512GB SSD",
    image: "💻",
    featured: true,
    rating: 4.5
  },
  {
    id: 2,
    name: "Handmade Leather Bag",
    price: 15000,
    category: "Fashion",
    vendor: "Sokoto Crafts",
    description: "Genuine leather handbag, locally made",
    image: "👜",
    featured: true,
    rating: 4.8
  },
  {
    id: 3,
    name: "Suya Spice Pack",
    price: 3500,
    category: "Food & Snacks",
    vendor: "Sokoto Spices",
    description: "Authentic suya spices and seasonings",
    image: "🌶️",
    featured: false,
    rating: 4.9
  }
];

const categories = [
  { name: "All", icon: "🛍️" },
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👕" },
  { name: "Food & Snacks", icon: "🍕" },
  { name: "Services", icon: "🛠️" }
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = sampleProducts.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">UC</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">UrbanColl</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="#products" className="text-gray-700 hover:text-blue-600 font-medium">Products</a>
              <a href="#vendors" className="text-gray-700 hover:text-blue-600 font-medium">Vendors</a>
            </nav>

            {/* Search & Cart */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <button className="relative p-2 text-gray-700 hover:text-blue-600">
                <span className="text-xl">🛒</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 hidden md:block">
                Become a Vendor
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting Buyers with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Right Vendors
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the best local products, food, snacks, and services in Sokoto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg">
              Start Shopping
            </button>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors text-lg">
              Sell on UrbanColl
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`bg-white p-6 rounded-xl shadow-sm border text-center transition-all ${
                  selectedCategory === category.name
                    ? 'ring-2 ring-blue-500 transform scale-105'
                    : 'hover:transform hover:scale-105'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-medium text-gray-900">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {selectedCategory === "All" ? "Featured Products" : selectedCategory}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-4xl text-center mb-4">{product.image}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(Math.floor(product.rating))}
                    {'☆'.repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span className="text-lg">🛒</span>
                  </button>
                </div>
                
                <div className="mt-2 text-sm text-gray-500">
                  By {product.vendor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
              <span className="text-xl font-bold">UC</span>
            </div>
            <span className="ml-2 text-xl font-bold">UrbanColl</span>
          </div>
          <p className="text-gray-400 mb-4">
            Connecting buyers with the right vendors in Sokoto
          </p>
          <p className="text-gray-400">
            &copy; 2024 UrbanColl. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}