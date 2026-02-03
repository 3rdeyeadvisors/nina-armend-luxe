
export interface MockProduct {
  id: string;
  title: string;
  handle: string;
  price: number;
  category: 'Top' | 'Bottom' | 'One-Piece' | 'Cover-up';
  images: string[];
  colors: string[];
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'm1',
    title: 'Copacabana Triangle Top',
    handle: 'copacabana-triangle-top',
    price: 85.00,
    category: 'Top',
    images: [
      'https://images.unsplash.com/photo-1590650213165-c1fef80648c4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1585145197082-dba093751931?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['Gold', 'Sand', 'Noir']
  },
  {
    id: 'm2',
    title: 'Copacabana Tie Bottom',
    handle: 'copacabana-tie-bottom',
    price: 75.00,
    category: 'Bottom',
    images: [
      'https://images.unsplash.com/photo-1544391496-1ca7c9765779?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1621949189041-99437996767e?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['Gold', 'Sand', 'Noir']
  },
  {
    id: 'm3',
    title: 'Ipanema Bandeau Top',
    handle: 'ipanema-bandeau-top',
    price: 90.00,
    category: 'Top',
    images: [
      'https://images.unsplash.com/photo-1506223580648-267923485f76?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['Emerald', 'Noir']
  },
  {
    id: 'm4',
    title: 'Ipanema High Waist Bottom',
    handle: 'ipanema-high-waist-bottom',
    price: 85.00,
    category: 'Bottom',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['Emerald', 'Noir']
  },
  {
    id: 'm5',
    title: 'Leblon Underwire Top',
    handle: 'leblon-underwire-top',
    price: 95.00,
    category: 'Top',
    images: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['Pearl', 'Midnight']
  },
  {
    id: 'm6',
    title: 'Leblon Cheeky Bottom',
    handle: 'leblon-cheeky-bottom',
    price: 70.00,
    category: 'Bottom',
    images: [
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['Pearl', 'Midnight']
  }
];
