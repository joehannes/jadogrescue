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
    title: 'The Builder',
    impact: ['Funds exactly 1 complete shelter', 'Materials + 4 hours of fair local labor', 'Reuses 200+ discarded bottles'],
  },
  {
    amount: 25,
    title: 'The Sustainer',
    impact: ['Funds 2 shelters', 'Maintenance kit for 3 existing shelters', 'Extra rope & palm fiber included'],
  },
  {
    amount: 50,
    title: 'Community Hero',
    impact: ['Funds 5 shelters in one neighborhood', 'Creates a safe zone for a local pack', 'Autonomous rainwater at each'],
  },
  {
    amount: 100,
    title: 'Squad Leader',
    impact: ['Funds a full Shelter Building Day', 'Employs 2 local workers for a week', 'Builds 10+ shelters'],
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
