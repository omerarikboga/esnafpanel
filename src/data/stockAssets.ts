import barberHero from '../assets/images/barber_craftsman_shop_1791753273928.jpg';
import bakeryHero from '../assets/images/artisan_bakery_bread_1791753285384.jpg';
import cafeHero from '../assets/images/cozy_artisan_cafe_1791753297038.jpg';
import autoHero from '../assets/images/modern_car_detailing_1791753307923.jpg';
import plumberHero from '../assets/images/plumber_tools_workshop_1791754402100.jpg';
import bakeryPastry from '../assets/images/traditional_bakery_patisserie_1791754412981.jpg';
import { SiteLayout } from '../types';

export interface StockAssetItem {
  id: string;
  title: string;
  category: string;
  url: string;
}

export const STOCK_IMAGES: StockAssetItem[] = [
  {
    id: 'img-barber-1',
    title: 'Usta Berber Salonu & Deri Koltuklar',
    category: 'barber',
    url: barberHero,
  },
  {
    id: 'img-bakery-1',
    title: 'Odun Ateşi Taş Fırın & Ekşi Mayalı Ekmek',
    category: 'bakery',
    url: bakeryHero,
  },
  {
    id: 'img-bakery-2',
    title: 'Çıtır Simit, Börek & Çay Tezgahı',
    category: 'bakery',
    url: bakeryPastry,
  },
  {
    id: 'img-cafe-1',
    title: 'Specialty Coffee Bar & Ferah Oturma Alanı',
    category: 'cafe',
    url: cafeHero,
  },
  {
    id: 'img-auto-1',
    title: 'LED Işıklı Seramik Kaplama & Oto Detailing',
    category: 'auto',
    url: autoHero,
  },
  {
    id: 'img-plumber-1',
    title: 'Profesyonel Tesisat Takımları & Kaçak Tespiti',
    category: 'plumber',
    url: plumberHero,
  },
];

export const DEFAULT_LAYOUT: SiteLayout = {
  heroLayout: 'split',
  servicesLayout: 'cards',
  productsLayout: 'grid',
  galleryLayout: 'grid',
  sectionsOrder: ['hero', 'services', 'products', 'about', 'gallery', 'testimonials', 'contact'],
  sectionsVisibility: {
    hero: true,
    services: true,
    products: true,
    about: true,
    gallery: true,
    testimonials: true,
    contact: true,
    booking: true,
  },
};
