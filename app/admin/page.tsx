'use client';

import Header from '@/components/Header';

import { useState } from 'react';
import { sampleProducts, sampleVendors, sampleOrders } from '@/lib/constants';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const stats = {
    totalRevenue: sampleOrders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: sampleOrders.length,
    totalProducts: sampleProducts.length,
    totalVendors: sampleVendors.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₦{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="bg-secondary-100 p-3 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-2xl">🛍️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVendors}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="card">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {['dashboard', 'products', 'vendors', 'orders', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {sampleOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-gray-600">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{order.total.toLocaleString()}</p>
                        <p className={`text-sm ${
                          order.status === 'completed' ? 'text-green-600' : 
                          order.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">All Products</h3>
                  <button className="btn-primary">Add Product</button>
                </div>
                <div className="space-y-4">
                  {sampleProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{product.image}</div>
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-gray-600">₦{product.price.toLocaleString()} • {product.vendor}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Settings</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paystack Public Key
                    </label>
                    <input type="text" className="input-field" placeholder="pk_test_..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paystack Secret Key
                    </label>
                    <input type="password" className="input-field" placeholder="sk_test_..." />
                  </div>
                  <button className="btn-primary">Save Settings</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
    </div>
  );
}