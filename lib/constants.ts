import { Product, Vendor, Order } from './types';

export const categories = [
  { name: "All", icon: "🛍️" },
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👕" },
  { name: "Food & Snacks", icon: "🍕" },
  { name: "Services", icon: "🛠️" },
  { name: "Home & Living", icon: "🏠" }
];

export const sampleProducts: Product[] = [
  {
    id: 1,
    name: "HP Laptop 15.6inch",
    price: 250000,
    category: "Electronics",
    vendor: "TechHub NG",
    description: "Brand new HP laptop with 8GB RAM, 512GB SSD, perfect for work and study",
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
    description: "Genuine leather handbag, locally made with traditional craftsmanship",
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
    description: "Authentic suya spices and seasonings, perfect for Nigerian barbecue",
    image: "🌶️",
    featured: false,
    rating: 4.9
  },
  {
    id: 4,
    name: "Carpentry Services",
    price: 50000,
    category: "Services",
    vendor: "Master Carpenters",
    description: "Professional carpentry services including furniture making and repairs",
    image: "🛠️",
    featured: true,
    rating: 4.7
  },
  {
    id: 5,
    name: "Wireless Earbuds",
    price: 12000,
    category: "Electronics",
    vendor: "Gadget World",
    description: "High-quality wireless earbuds with noise cancellation and 20hr battery",
    image: "🎧",
    featured: false,
    rating: 4.3
  },
  {
    id: 6,
    name: "Traditional Kaftan",
    price: 8000,
    category: "Fashion",
    vendor: "Sokoto Fashion",
    description: "Beautiful traditional kaftan with intricate embroidery, perfect for special occasions",
    image: "👘",
    featured: true,
    rating: 4.6
  },
  {
    id: 7,
    name: "Local Rice (50kg)",
    price: 40000,
    category: "Food & Snacks",
    vendor: "Sokoto Grains",
    description: "Premium quality local rice, freshly harvested and processed",
    image: "🍚",
    featured: false,
    rating: 4.4
  },
  {
    id: 8,
    name: "Phone Repair Services",
    price: 10000,
    category: "Services",
    vendor: "Phone Fixers",
    description: "Professional phone repair services for all brands and models",
    image: "📱",
    featured: false,
    rating: 4.2
  }
];

export const sampleVendors: Vendor[] = [
  {
    id: 1,
    name: "TechHub NG",
    email: "contact@techhub.ng",
    phone: "+234 800 000 0001",
    businessType: "Electronics",
    status: "approved",
    joinDate: "2024-01-15"
  },
  {
    id: 2,
    name: "Sokoto Crafts",
    email: "info@sokotocrafts.com",
    phone: "+234 800 000 0002",
    businessType: "Fashion",
    status: "approved",
    joinDate: "2024-01-20"
  },
  {
    id: 3,
    name: "Master Carpenters",
    email: "hello@mastercarpenters.com",
    phone: "+234 800 000 0003",
    businessType: "Services",
    status: "approved",
    joinDate: "2024-02-01"
  }
];

export const sampleOrders: Order[] = [
  {
    id: 1001,
    customerName: "John Doe",
    customerEmail: "john@example.com",
    total: 265000,
    status: "completed",
    orderDate: "2024-03-01",
    items: [
      { product: sampleProducts[0], quantity: 1 },
      { product: sampleProducts[4], quantity: 1 }
    ]
  },
  {
    id: 1002,
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    total: 23000,
    status: "pending",
    orderDate: "2024-03-02",
    items: [
      { product: sampleProducts[1], quantity: 1 },
      { product: sampleProducts[5], quantity: 1 }
    ]
  }
];