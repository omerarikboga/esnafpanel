export type BusinessCategory =
  | 'barber'
  | 'bakery'
  | 'cafe'
  | 'plumber'
  | 'auto'
  | 'dentist'
  | 'florist'
  | 'custom';

export type SiteStatus = 'published' | 'draft' | 'maintenance';

export interface WorkingHourItem {
  days: string;
  hours: string;
  isClosed?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  category?: string;
  description: string;
  price: string;
  duration?: string;
  featured?: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  tag?: string;
  image?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  roleOrLocation: string;
  comment: string;
  rating: number;
  date?: string;
}

export interface SiteTheme {
  primaryColor: string; // e.g. '#d97706', '#16a34a', '#0284c7', '#9333ea', '#e11d48', '#2563eb'
  accentColor: string;
  fontStyle: 'sans' | 'serif' | 'modern';
  themePreset: 'amber-artisan' | 'emerald-fresh' | 'navy-corporate' | 'dark-slate' | 'rose-boutique' | 'stone-classic';
}

export interface SiteLayout {
  heroLayout: 'split' | 'fullscreen' | 'centered' | 'minimal';
  servicesLayout: 'cards' | 'classic-list' | 'detailed';
  productsLayout: 'grid' | 'compact-list';
  galleryLayout: 'grid' | 'masonry';
  sectionsOrder: string[]; // ['hero', 'services', 'products', 'about', 'gallery', 'testimonials', 'contact']
  sectionsVisibility: {
    hero: boolean;
    services: boolean;
    products: boolean;
    about: boolean;
    gallery: boolean;
    testimonials: boolean;
    contact: boolean;
    booking: boolean;
  };
}

export interface ClientSite {
  id: string;
  name: string;
  slug: string;
  category: BusinessCategory;
  categoryLabel: string;
  status: SiteStatus;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  inquiryCount: number;
  theme: SiteTheme;
  layout: SiteLayout;
  generalInfo: {
    tagline: string;
    description: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    districtCity: string;
    mapQuery: string;
    workingHours: WorkingHourItem[];
    socials: {
      instagram?: string;
      facebook?: string;
      googleMaps?: string;
    };
  };
  hero: {
    badgeText: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    heroImage: string;
    features: string[];
  };
  services: ServiceItem[];
  products: ProductItem[];
  gallery: GalleryItem[];
  testimonials: TestimonialItem[];
  about: {
    title: string;
    story: string;
    experienceYears: string;
    highlights: { label: string; value: string }[];
  };
  bookingSettings: {
    enabled: boolean;
    type: 'appointment' | 'order' | 'quote';
    title: string;
    subtitle: string;
    buttonLabel: string;
    confirmationText: string;
  };
}

export interface LeadSubmission {
  id: string;
  siteId: string;
  siteName: string;
  category: BusinessCategory;
  type: 'appointment' | 'order' | 'quote' | 'contact';
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceRequested?: string;
  requestedDate?: string;
  requestedTime?: string;
  notes?: string;
  address?: string;
  status: 'new' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BusinessTemplate {
  id: string;
  title: string;
  category: BusinessCategory;
  categoryLabel: string;
  description: string;
  badge: string;
  previewImage: string;
  siteData: Omit<ClientSite, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiryCount'>;
}
