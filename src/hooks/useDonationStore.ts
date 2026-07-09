import { create } from 'zustand';
import { DonationTier, DonationFormData } from '../types';

interface DonationState {
  selectedTier: DonationTier | null;
  customAmount: number;
  cart: DonationFormData[];
  setSelectedTier: (tier: DonationTier | null) => void;
  setCustomAmount: (amount: number) => void;
  addToCart: (donation: DonationFormData) => void;
  clearCart: () => void;
}

export const donationTiers: DonationTier[] = [
  {
    amount: 10,
    title: 'Builder',
    impact: ['Builds 1 shelter', 'Uses 200+ recycled bottles', 'Provides rainwater system'],
  },
  {
    amount: 25,
    title: 'Sustainer',
    impact: ['Builds 2.5 shelters', 'Feeds 1 dog for a month', 'Supports local builder'],
  },
  {
    amount: 50,
    title: 'Hero',
    impact: ['Builds 5 shelters', 'Feeds 3 dogs for a month', 'Includes medical checkups'],
  },
  {
    amount: 100,
    title: 'Leader',
    impact: ['Builds 10 shelters', 'Feeds 5 dogs for a month', 'Full community program'],
  },
];

export const useDonationStore = create<DonationState>((set) => ({
  selectedTier: null,
  customAmount: 0,
  cart: [],
  setSelectedTier: (tier) => set({ selectedTier: tier }),
  setCustomAmount: (amount) => set({ customAmount: amount }),
  addToCart: (donation) =>
    set((state) => ({ cart: [...state.cart, donation] })),
  clearCart: () => set({ cart: [] }),
}));
