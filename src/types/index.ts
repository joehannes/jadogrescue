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
