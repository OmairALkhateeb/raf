import { Review } from '@/types';

export const reviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1', // Amouage Gold Woman
    author: 'Khalid Al-Balushi',
    rating: 5,
    date: '2024-10-12',
    title: 'Absolutely regal',
    body: 'Bought this as a gift and the reaction was priceless. Truly the king of fragrances — the longevity is incredible, still going strong after 18 hours.',
    verified: true,
    helpful: 42,
  },
  {
    id: 'r2',
    productId: 'p1',
    author: 'Sarah Mitchell',
    rating: 5,
    date: '2024-09-25',
    title: 'Worth every rial',
    body: 'The bottle is gorgeous and the scent is unlike anything else. A few sprays last all day. True luxury.',
    verified: true,
    helpful: 38,
  },
  {
    id: 'r3',
    productId: 'p7', // Velvet Second-Skin Foundation
    author: 'Noura Al-Kindi',
    rating: 5,
    date: '2024-11-02',
    title: 'Made for our weather',
    body: 'Finally a foundation that survives Muscat humidity. The satin finish looks like skin and it genuinely lasts all day without oxidising. Shade match was spot on.',
    verified: true,
    helpful: 67,
  },
  {
    id: 'r4',
    productId: 'p12', // Glow Theory Vitamin C Serum
    author: 'Dr. Fatima Al-Rawahi',
    rating: 5,
    date: '2024-11-01',
    title: 'My dark spots faded',
    body: 'Four weeks in and my skin tone is visibly more even. Lightweight, absorbs fast, no sticky feel. I layer it under sunscreen every morning.',
    verified: true,
    helpful: 56,
  },
  {
    id: 'r5',
    productId: 'p16', // Lash Atelier Wispy Strip Lashes
    author: 'Mariam Al-Zadjali',
    rating: 5,
    date: '2024-10-20',
    title: 'So natural and reusable',
    body: 'Feather-light, comfortable for hours, and I’ve already reused them several times. The wispy style looks effortless — perfect for daytime.',
    verified: true,
    helpful: 44,
  },
  {
    id: 'r6',
    productId: 'p25', // VitaCore Whey Protein Isolate
    author: 'Abdullah Al-Hinai',
    rating: 5,
    date: '2024-10-28',
    title: 'Clean and mixes well',
    body: 'No bloating, no hidden sugar, and it actually mixes smooth with just a shaker. Great after training. The chocolate flavour is not too sweet.',
    verified: true,
    helpful: 29,
  },
  {
    id: 'r7',
    productId: 'p30', // Maison Gift Wedding Luxe Bundle
    author: 'James Turner',
    rating: 5,
    date: '2024-10-05',
    title: 'Beautifully packaged',
    body: 'Ordered as a wedding gift and it arrived looking premium — the box, the wrapping, everything. Saved me so much effort and looked far more expensive than it was.',
    verified: false,
    helpful: 31,
  },
  {
    id: 'r8',
    productId: 'p22', // Lumina IPL Hair Removal Handset
    author: 'Aisha Al-Habsi',
    rating: 4,
    date: '2024-11-08',
    title: 'Visible results by week 4',
    body: 'Easy to use at home and noticeably less regrowth after a month of weekly sessions. Wish it came with a few more intensity levels, but I’m happy overall.',
    verified: true,
    helpful: 38,
  },
];

export const getReviewsByProductId = (productId: string): Review[] => {
  return reviews.filter(r => r.productId === productId);
};
