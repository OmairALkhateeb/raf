export interface Product {
  id: string;
  name: string;
  nameAr: string;
  brand: string;
  brandAr: string;
  brandId: string;
  category: string;
  categoryAr: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  descriptionAr: string;
  specifications: Specification[];
  tags: string[];
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  discount?: number;
  colors?: string[];
  sizes?: string[];
}

export interface Specification {
  key: string;
  keyAr: string;
  value: string;
  valueAr: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
}

export interface Brand {
  id: string;
  name: string;
  nameAr: string;
  logo: string;
  description: string;
  descriptionAr: string;
  origin: string;
  featured: boolean;
  productCount: number;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  icon: string;
  productCount: number;
  featured: boolean;
}

export interface Banner {
  id: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  cta: string;
  ctaAr: string;
  ctaLink: string;
  image: string;
  mobileImage: string;
  bgColor: string;
  textColor: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  trackingNumber?: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  governorate: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  orders: Order[];
}

export type Language = 'en' | 'ar';
export type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
