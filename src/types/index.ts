// Shelter Data Types
export interface Shelter {
  id: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };
  built: string; // ISO date
  builder: string;
  photos: string[]; // Cloudinary URLs
  status: 'active' | 'construction' | 'planned';
  dogs: number;
  hasRainwater: boolean;
}

// Blog Post Types
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  verified: boolean;
  content: string; // Markdown
  excerpt?: string;
  heroImage?: string;
  readingTime?: number; // minutes
}

// Donation Types
export interface DonationTier {
  amount: number;
  title: string;
  impact: string[];
}

export interface DonationFormData {
  name: string;
  email: string;
  amount: number;
  isRecurring: boolean;
  paymentMethod: 'paypal' | 'stripe' | 'gofundme';
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface VolunteerFormData {
  name: string;
  email: string;
  skills: string;
  availability: string;
  message: string;
}

export interface PartnerFormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
}

// Events / Calendar Types
export interface CalendarSource {
  id: string; // internal id
  name: string; // display name, e.g. "Public Events"
  calendarId: string; // Google calendar id (email-like) or ICS id
  color: string; // hex used for dots/badges
  isPublic: boolean; // if true, show a "subscribe" button for visitors
  enabled: boolean; // shown by default in the calendar
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start: string; // ISO datetime (or date for all-day)
  end?: string; // ISO datetime
  allDay: boolean;
  url?: string; // link back to the event (Google htmlLink)
  sourceId: string; // which CalendarSource it belongs to
  color: string; // resolved from the source
  isMock?: boolean; // true for built-in example events
}

// Shop / Printify Types
export interface ShopProduct {
  id: string;
  title: string;
  description?: string;
  image: string;
  price: number; // in whole currency units (e.g. dollars)
  currency: string; // e.g. "USD"
  productType?: string; // "Hoodie", "Mug", "Tote"...
  tags?: string[];
  buyUrl?: string; // external storefront / product link
  isMock?: boolean;
}

// Recurring-support platform (Patreon, Ko-fi, ...)
export interface SupportPlatform {
  id: string; // 'patreon' | 'kofi' | 'bmac' | 'opencollective' | 'liberapay' | 'paypal'
  enabled: boolean;
  url: string; // full URL to the org's page on that platform
  handle?: string; // optional display handle
}
