export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 1200,
    image: 'https://via.placeholder.com/300x200',
    description: 'The latest iPhone 15 Pro with A17 chip and Titanium body.',
  },
  {
    id: 2,
    name: 'MacBook Air M3',
    price: 1600,
    image: 'https://via.placeholder.com/300x200',
    description: 'Lightweight, powerful MacBook Air with M3 chip.',
  },
  {
    id: 3,
    name: 'AirPods Pro 2',
    price: 250,
    image: 'https://via.placeholder.com/300x200',
    description: 'Wireless earbuds with active noise cancellation.',
  },
];
