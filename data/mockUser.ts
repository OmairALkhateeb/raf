import { User, Order } from '@/types';
import { products } from './products';

export const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    date: '2024-11-15',
    status: 'delivered',
    items: [
      { product: products[0], quantity: 1 },
      { product: products[6], quantity: 2 },
    ],
    total: 62.0,
    trackingNumber: 'OM1234567890',
  },
  {
    id: 'ORD-2024-002',
    date: '2024-12-02',
    status: 'shipped',
    items: [
      { product: products[4], quantity: 1 },
      { product: products[12], quantity: 1 },
    ],
    total: 29.5,
    trackingNumber: 'OM0987654321',
  },
  {
    id: 'ORD-2024-003',
    date: '2024-12-10',
    status: 'processing',
    items: [
      { product: products[11], quantity: 1 },
    ],
    total: 32.0,
  },
];

export const mockUser: User = {
  id: 'u1',
  name: 'Mohammed Al-Rashidi',
  email: 'mohammed@example.com',
  phone: '+968 9123 4567',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  addresses: [
    {
      id: 'addr1',
      label: 'Home',
      fullName: 'Mohammed Al-Rashidi',
      phone: '+968 9123 4567',
      street: '123 Al-Qurum Street',
      city: 'Muscat',
      governorate: 'Muscat',
      isDefault: true,
    },
    {
      id: 'addr2',
      label: 'Work',
      fullName: 'Mohammed Al-Rashidi',
      phone: '+968 9123 4567',
      street: '45 CBD Tower, Floor 8',
      city: 'Muscat',
      governorate: 'Muscat',
      isDefault: false,
    },
  ],
  orders: mockOrders,
};
