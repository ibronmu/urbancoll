'use client';

import Header from '@/components/Header';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { sampleProducts } from '@/lib/constants';

export default function ProductPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const product = sampleProducts.find(p => p.id === productId);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        </div>
        
      </div>
    );
  }

  const relatedProducts = sampleProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-600 mb-8">
          <a href="/" className="hover:text-primary-600">Home</a>
          <span className="mx-2">/</span>
          <a href={`/#products`} className="hover:text-primary-600">Products</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="w-full max-w-2xl mx-auto mt-6 sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 bg-white rounded-md flex items-center justify-center text-2xl ${
                      selectedImage === index
                        ? 'ring-2 ring-primary-500'
                        : 'ring-1 ring-gray-200'
                    }`}
                  >
                    {product.image}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full aspect-w-1 aspect-h-1">
              <div className="w-full h-96 bg-white rounded-lg flex items-center justify-center text-8xl">
                {product.image}
              </div>
            </div>
          </div>
          
          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-primary-600 font-semibold">
                ₦{product.price.toLocaleString()}
              </p>
            </div>
            
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <span
                      key={rating}
                      className={`text-xl ${
                        rating < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-900">
                  {product.rating} out of 5 stars
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center">
                <span className="text-gray-700">Vendor:</span>
                <span className="ml-2 font-medium text-gray-900">{product.vendor}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-700">Category:</span>
                <span className="ml-2 font-medium text-gray-900">{product.category}</span>
              </div>
            </div>
            
            <div className="mt-10 flex sm:flex-col1">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-700"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-700"
                  >
                    +
                  </button>
                </div>
                
                <button className="flex-1 btn-primary py-4">
                  Add to Cart
                </button>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">Shipping & Returns</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ul role="list">
                  <li>Local pickup available in Sokoto</li>
                  <li>Contact vendor for specific pickup locations</li>
                  <li>7-day return policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-gray-200 py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="card group">
                  <div className="p-6">
                    <div className="text-4xl text-center mb-4">{relatedProduct.image}</div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedProduct.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ₦{relatedProduct.price.toLocaleString()}
                      </span>
                      <button className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors">
                        🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      
    </div>
  );
}