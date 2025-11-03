export interface Product {
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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  status: 'pending' | 'approved' | 'rejected';
  joinDate: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  orderDate: string;
  items: CartItem[];
}