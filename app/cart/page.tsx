'use client';

import Header from '@/components/Header';
import { useState } from 'react';
import { sampleProducts } from '@/lib/constants';

// This would typically come from a cart context or state management
const sampleCartItems = [
  { product: sampleProducts[0], quantity: 2 },
  { product: sampleProducts[1], quantity: 1 },
  { product: sampleProducts[2], quantity: 3 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(sampleCartItems);

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      setCartItems(cartItems.filter(item => item.product.id !== productId));
      return;
    }
    setCartItems(cartItems.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeItem = (productId: number) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = 0; // Local pickup
  const tax = subtotal * 0.05; // 5% VAT
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <button className="btn-primary">Continue Shopping</button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            {/* Cart Items */}
            <div className="lg:col-span-7">
              <div className="card">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">Cart Items ({cartItems.length})</h2>
                </div>
                
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{item.product.image}</div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                          <p className="text-gray-600 text-sm">{item.product.vendor}</p>
                          <p className="text-primary-600 font-semibold mt-1">
                            ₦{item.product.price.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <div className="card p-6 sticky top-8">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">₦{shipping.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5% VAT)</span>
                    <span className="font-medium">₦{tax.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full btn-primary py-4 mb-4">
                  Proceed to Checkout
                </button>
                
                <button className="w-full btn-secondary py-4">
                  Continue Shopping
                </button>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    📍 <strong>Local Pickup Only:</strong> All orders are for local pickup from vendors in Sokoto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}