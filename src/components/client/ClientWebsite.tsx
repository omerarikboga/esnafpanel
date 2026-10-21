import React, { useState } from 'react';
import { ClientSite, LeadSubmission } from '../../types';
import { BookingModal } from './BookingModal';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Calendar, 
  Star, 
  Check, 
  ArrowLeft, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ChevronRight,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';

interface ClientWebsiteProps {
  site: ClientSite;
  onBackToAdmin?: () => void;
  onEditSite?: (site: ClientSite) => void;
  onSubmitBooking: (submission: Partial<LeadSubmission>) => Promise<void>;
  isStandalone?: boolean;
}

export const ClientWebsite: React.FC<ClientWebsiteProps> = ({
  site,
  onBackToAdmin,
  onEditSite,
  onSubmitBooking,
  isStandalone = false,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const themePrimary = site.theme.primaryColor || '#d97706';
  const layout = site.layout || {
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

  const handleOpenBooking = (serviceName?: string) => {
    setSelectedService(serviceName || '');
    setIsBookingOpen(true);
  };

  const getCleanWhatsapp = () => {
    const raw = site.generalInfo.whatsapp || site.generalInfo.phone;
    const clean = raw.replace(/\D/g, '');
    if (clean.startsWith('90')) return clean;
    if (clean.startsWith('0')) return '9' + clean;
    return '90' + clean;
  };

  const getFontClass = () => {
    if (site.theme.fontStyle === 'serif') return 'font-serif';
    return 'font-sans';
  };

  // Group services by category
  const serviceCategories = ['all', ...Array.from(new Set(site.services.map((s) => s.category || 'Genel')))];

  const filteredServices = site.services.filter(
    (s) => activeCategory === 'all' || (s.category || 'Genel') === activeCategory
  );

  // SECTION RENDERERS
  const renderHeroSection = () => {
    if (!layout.sectionsVisibility.hero) return null;

    if (layout.heroLayout === 'fullscreen') {
      return (
        <section id="hero" className="relative min-h-[580px] sm:min-h-[680px] flex items-center justify-center border-b border-neutral-900 overflow-hidden">
          {/* Background image with cinematic dark scrim */}
          <div className="absolute inset-0">
            <img
              src={site.hero.heroImage}
              alt={site.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 space-y-6">
            {site.hero.badgeText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                <span>{site.hero.badgeText}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight text-balance">
              {site.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto text-balance">
              {site.hero.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {site.hero.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-200 bg-neutral-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800/80">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {site.bookingSettings.enabled && (
                <button
                  onClick={() => handleOpenBooking()}
                  style={{ backgroundColor: themePrimary }}
                  className="px-6 py-3.5 text-white text-sm font-bold rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{site.hero.primaryCtaText || 'Online Randevu Al'}</span>
                </button>
              )}

              <a
                href={`https://wa.me/${getCleanWhatsapp()}?text=${encodeURIComponent(
                  `Merhaba, ${site.name} web sitenizden ulaşıyorum. Bilgi almak istiyorum.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp İletişim</span>
              </a>
            </div>
          </div>
        </section>
      );
    }

    if (layout.heroLayout === 'centered') {
      return (
        <section id="hero" className="py-16 sm:py-20 border-b border-neutral-900 bg-neutral-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
            <div className="space-y-4 max-w-3xl mx-auto">
              {site.hero.badgeText && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <span>{site.hero.badgeText}</span>
                </div>
              )}
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
                {site.hero.title}
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
                {site.hero.subtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {site.bookingSettings.enabled && (
                  <button
                    onClick={() => handleOpenBooking()}
                    style={{ backgroundColor: themePrimary }}
                    className="px-6 py-3 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{site.hero.primaryCtaText || 'Online Randevu Al'}</span>
                  </button>
                )}
                <a
                  href={`tel:${site.generalInfo.phone}`}
                  className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs sm:text-sm font-semibold rounded-xl border border-neutral-800 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{site.generalInfo.phone}</span>
                </a>
              </div>
            </div>

            <div className="relative aspect-[16/8] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
              <img
                src={site.hero.heroImage}
                alt={site.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      );
    }

    // Default 'split' Layout
    return (
      <section id="hero" className="relative overflow-hidden pt-10 pb-16 sm:py-20 border-b border-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Text & CTA */}
            <div className="space-y-6">
              {site.hero.badgeText && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <span>{site.hero.badgeText}</span>
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
                {site.hero.title}
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                {site.hero.subtitle}
              </p>

              {/* Bullet points */}
              <div className="space-y-2.5 pt-1">
                {site.hero.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-200">
                    <div
                      style={{ color: themePrimary }}
                      className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0"
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {site.bookingSettings.enabled && (
                  <button
                    onClick={() => handleOpenBooking()}
                    style={{ backgroundColor: themePrimary }}
                    className="px-5 py-3 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{site.hero.primaryCtaText || 'Online Randevu Al'}</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/${getCleanWhatsapp()}?text=${encodeURIComponent(
                    `Merhaba, ${site.name} web sitenizden ulaşıyorum. Bilgi almak istiyorum.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp İletişim</span>
                </a>
              </div>
            </div>

            {/* Right: High-Resolution Visual */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
                <img
                  src={site.hero.heroImage}
                  alt={site.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-neutral-950/80 backdrop-blur-md rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{site.name}</span>
                    <span className="text-neutral-400 text-[11px]">{site.generalInfo.districtCity}</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px]">
                    ★ 4.9 (Google)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderServicesSection = () => {
    if (!layout.sectionsVisibility.services || site.services.length === 0) return null;

    const isClassicList = layout.servicesLayout === 'classic-list';

    return (
      <section id="services" className="py-16 border-b border-neutral-900 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Hizmetler & Ücretler
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Şeffaf Fiyat Listemiz & Hizmetlerimiz
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Sürpriz ek maliyet olmadan, usta ellerde garantili hizmet almanın rahatlığını yaşayın.
            </p>
          </div>

          {/* Category filter pills */}
          {serviceCategories.length > 2 && (
            <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {serviceCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-neutral-800 text-amber-400 border border-neutral-700'
                      : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {cat === 'all' ? 'Tüm Hizmetler' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Layout Variant 1: Classic Turkish Craftsman Price Board with Dotted Lines */}
          {isClassicList ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 divide-y divide-neutral-800 max-w-4xl mx-auto shadow-xl">
              {filteredServices.map((srv) => (
                <div key={srv.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 group">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                        {srv.name}
                      </span>
                      {srv.duration && (
                        <span className="text-[11px] text-neutral-500 font-mono">
                          ({srv.duration})
                        </span>
                      )}
                    </div>
                    {srv.description && (
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                        {srv.description}
                      </p>
                    )}
                  </div>

                  {/* Dotted line leader */}
                  <div className="hidden sm:block flex-1 border-b border-dotted border-neutral-700 mx-2 mb-1 opacity-40" />

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                      {srv.price}
                    </span>
                    {site.bookingSettings.enabled && (
                      <button
                        onClick={() => handleOpenBooking(srv.name)}
                        className="px-3 py-1 bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                      >
                        Randevu
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Layout Variant 2: Modern Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 flex flex-col justify-between transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                        {srv.name}
                      </h3>
                      <span className="text-base font-bold font-mono text-amber-400 whitespace-nowrap tabular-nums">
                        {srv.price}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    {srv.duration ? (
                      <span className="flex items-center gap-1 text-neutral-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        {srv.duration}
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-500">Standart İşlem</span>
                    )}

                    {site.bookingSettings.enabled && (
                      <button
                        onClick={() => handleOpenBooking(srv.name)}
                        className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Randevu Seç</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderProductsSection = () => {
    if (!layout.sectionsVisibility.products || site.products.length === 0) return null;

    const isCompact = layout.productsLayout === 'compact-list';

    return (
      <section id="products" className="py-16 border-b border-neutral-900 bg-neutral-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Günlük Taze Lezzetler
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Öne Çıkan Ürün & Menü Vitrini
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Fırından yeni çıkmış sıcacık ekmekler, tatlılar ve özel menüler.
            </p>
          </div>

          {isCompact ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800 max-w-3xl mx-auto p-4 sm:p-6">
              {site.products.map((prd) => (
                <div key={prd.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{prd.name}</span>
                      {prd.tag && (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          {prd.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{prd.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-bold text-amber-400 text-sm">{prd.price}</span>
                    {site.bookingSettings.enabled && (
                      <button
                        onClick={() => handleOpenBooking(prd.name)}
                        className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded cursor-pointer"
                      >
                        Sipariş
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {site.products.map((prd) => (
                <div
                  key={prd.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-white">
                        {prd.name}
                      </h3>
                      <span className="text-sm font-bold font-mono text-amber-400 tabular-nums">
                        {prd.price}
                      </span>
                    </div>

                    {prd.tag && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {prd.tag}
                      </span>
                    )}

                    <p className="mt-2 text-xs text-neutral-400">
                      {prd.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-500">{prd.category}</span>
                    {site.bookingSettings.enabled && (
                      <button
                        onClick={() => handleOpenBooking(prd.name)}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        Sipariş Ekle
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderAboutSection = () => {
    if (!layout.sectionsVisibility.about) return null;

    return (
      <section id="about" className="py-16 border-b border-neutral-900 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 space-y-6">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Hikayemiz & Ustalığımız
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {site.about.title}
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {site.about.story}
              </p>
            </div>

            {/* Highlights Counter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-800">
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono tabular-nums">
                  {site.about.experienceYears}
                </span>
                <span className="text-xs text-neutral-400 block">Sektörel Deneyim</span>
              </div>

              {site.about.highlights.map((hl, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
                    {hl.value}
                  </span>
                  <span className="text-xs text-neutral-400 block">{hl.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderGallerySection = () => {
    if (!layout.sectionsVisibility.gallery || site.gallery.length === 0) return null;

    return (
      <section id="gallery" className="py-16 border-b border-neutral-900 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Fotoğraf Galerisi
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              İşletmemizden ve Çalışmalarımızdan Kareler
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {site.gallery.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-semibold text-white">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderTestimonialsSection = () => {
    if (!layout.sectionsVisibility.testimonials || site.testimonials.length === 0) return null;

    return (
      <section id="reviews" className="py-16 border-b border-neutral-900 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Müşteri Memnuniyeti
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Gerçek Müşteri Yorumları
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Bizi tercih eden müşterilerimizin deneyimleri ve değerlendirmeleri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {site.testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{t.author}</span>
                  <span className="text-neutral-500 text-[11px]">{t.roleOrLocation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderContactSection = () => {
    if (!layout.sectionsVisibility.contact) return null;

    return (
      <section id="contact" className="py-16 bg-neutral-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Working hours & Contact Info */}
            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Ulaşım & Ziyaret
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">
                  İletişim & Çalışma Saatlerimiz
                </h2>
                <p className="mt-2 text-xs text-neutral-400">
                  Bizi dilediğiniz zaman telefonla arayabilir veya WhatsApp üzerinden hemen soru sorabilirsiniz.
                </p>
              </div>

              {/* Working Hours Table */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white pb-2 border-b border-neutral-800">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Haftalık Çalışma Saatleri</span>
                </div>
                {site.generalInfo.workingHours.map((wh, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <span className="text-neutral-300">{wh.days}</span>
                    <span className="text-neutral-400 font-mono font-medium">{wh.hours}</span>
                  </div>
                ))}
              </div>

              {/* Contact cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${site.generalInfo.phone}`}
                  className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center gap-3 hover:border-neutral-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-neutral-500 block">Doğrudan Arayın</span>
                    <span className="text-xs font-semibold text-white font-mono truncate block">
                      {site.generalInfo.phone}
                    </span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${getCleanWhatsapp()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center gap-3 hover:border-emerald-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-neutral-500 block">WhatsApp Canlı Hat</span>
                    <span className="text-xs font-semibold text-emerald-400 truncate block">
                      Mesaj Gönder
                    </span>
                  </div>
                </a>
              </div>

              {/* Address */}
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-white block">Adresimiz</span>
                  <p className="text-neutral-300 mt-0.5">{site.generalInfo.address}</p>
                  <span className="text-neutral-400 text-[11px] block mt-0.5">
                    {site.generalInfo.districtCity}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Booking Form Embed */}
            {site.bookingSettings.enabled && layout.sectionsVisibility.booking && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-400">Online Başvuru</span>
                  <h3 className="text-lg font-bold text-white">
                    {site.bookingSettings.title}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {site.bookingSettings.subtitle}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleOpenBooking()}
                    style={{ backgroundColor: themePrimary }}
                    className="w-full py-3 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{site.bookingSettings.buttonLabel || 'Formu Aç ve Talebini İlet'}</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-neutral-800 text-center text-xs text-neutral-500">
                  Talebiniz kaydedildikten sonra 10-15 dakika içinde telefonla teyit için aranacaksınız.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  // Section Map
  const sectionMap: Record<string, () => React.ReactNode> = {
    hero: renderHeroSection,
    services: renderServicesSection,
    products: renderProductsSection,
    about: renderAboutSection,
    gallery: renderGallerySection,
    testimonials: renderTestimonialsSection,
    contact: renderContactSection,
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Top Admin Bar (When viewed from builder) */}
      {!isStandalone && onBackToAdmin && (
        <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Yönetim Paneline Dön
            </button>
            <div className="hidden sm:flex items-center gap-2 text-neutral-400">
              <span className="font-semibold text-white">{site.name}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-amber-400">/{site.slug}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                  site.status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {site.status === 'published' ? 'Yayında' : 'Taslak'}
              </span>
            </div>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                deviceMode === 'desktop' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-500 hover:text-white'
              }`}
              title="Masaüstü Görünüm"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                deviceMode === 'tablet' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-500 hover:text-white'
              }`}
              title="Tablet Görünüm"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                deviceMode === 'mobile' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-500 hover:text-white'
              }`}
              title="Mobil Görünüm"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {onEditSite && (
            <button
              onClick={() => onEditSite(site)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-md transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              İçerik & Yapıyı Düzenle
            </button>
          )}
        </div>
      )}

      {/* Website Viewport Container */}
      <div className={`flex-1 flex justify-center ${deviceMode !== 'desktop' ? 'p-4 sm:p-8 bg-neutral-900/60' : ''}`}>
        <div
          className={`w-full transition-all duration-300 bg-neutral-950 text-neutral-100 flex flex-col ${
            deviceMode === 'mobile'
              ? 'max-w-[390px] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden min-h-[844px]'
              : deviceMode === 'tablet'
              ? 'max-w-[768px] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden'
              : 'max-w-full'
          } ${getFontClass()}`}
        >
          {/* 1. PUBLIC SITE HEADER / TOP BAR */}
          <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
              {/* Brand Wordmark */}
              <a href="#hero" className="text-base sm:text-lg font-bold tracking-tight text-white truncate shrink-0">
                {site.name}
              </a>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-300">
                {site.services.length > 0 && layout.sectionsVisibility.services && (
                  <a href="#services" className="hover:text-white transition-colors whitespace-nowrap">
                    Hizmetler & Fiyatlar
                  </a>
                )}
                {site.products.length > 0 && layout.sectionsVisibility.products && (
                  <a href="#products" className="hover:text-white transition-colors whitespace-nowrap">
                    Menü & Ürünler
                  </a>
                )}
                {layout.sectionsVisibility.about && (
                  <a href="#about" className="hover:text-white transition-colors whitespace-nowrap">
                    Hakkımızda
                  </a>
                )}
                {site.gallery.length > 0 && layout.sectionsVisibility.gallery && (
                  <a href="#gallery" className="hover:text-white transition-colors whitespace-nowrap">
                    Galeri
                  </a>
                )}
                {site.testimonials.length > 0 && layout.sectionsVisibility.testimonials && (
                  <a href="#reviews" className="hover:text-white transition-colors whitespace-nowrap">
                    Müşteri Yorumları
                  </a>
                )}
                {layout.sectionsVisibility.contact && (
                  <a href="#contact" className="hover:text-white transition-colors whitespace-nowrap">
                    İletişim & Konum
                  </a>
                )}
              </nav>

              {/* Action Button */}
              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={`tel:${site.generalInfo.phone}`}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-800 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{site.generalInfo.phone}</span>
                </a>

                {site.bookingSettings.enabled && layout.sectionsVisibility.booking && (
                  <button
                    onClick={() => handleOpenBooking()}
                    style={{ backgroundColor: themePrimary }}
                    className="px-3.5 py-2 text-white text-xs font-semibold rounded-lg shadow-sm hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap"
                  >
                    {site.bookingSettings.buttonLabel || 'Randevu Al'}
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* DYNAMIC SECTIONS IN CONFIGURED ORDER */}
          {layout.sectionsOrder.map((sectionKey) => {
            const renderer = sectionMap[sectionKey];
            if (!renderer) return null;
            return <React.Fragment key={sectionKey}>{renderer()}</React.Fragment>;
          })}

          {/* 8. FOOTER */}
          <footer className="py-8 bg-neutral-950 border-t border-neutral-900 text-xs text-neutral-500">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                © {new Date().getFullYear()} {site.name}. Tüm hakları saklıdır.
              </div>
              <div className="flex items-center gap-4">
                <span>{site.generalInfo.districtCity}</span>
                <span aria-hidden="true">·</span>
                <span>Esnaf Web Altyapısı</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Booking Form Modal */}
      {isBookingOpen && (
        <BookingModal
          site={site}
          preSelectedService={selectedService}
          onClose={() => setIsBookingOpen(false)}
          onSubmit={async (sub) => {
            await onSubmitBooking(sub);
          }}
        />
      )}
    </div>
  );
};
