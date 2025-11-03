import { Product } from '@/lib/types';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="card group">
      <div className="p-6">
        <div className="text-4xl text-center mb-4">{product.image}</div>
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ₦{product.price.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors transform hover:scale-110"
          >
            <span className="text-lg">🛒</span>
          </button>
        </div>
        
        <div className="mt-2 text-sm text-gray-500 flex justify-between">
          <span>By {product.vendor}</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.category}</span>
        </div>
      </div>
    </div>
  );
}