import React, { useState } from 'react';
import { BusinessTemplate, ClientSite, SiteLayout } from '../../types';
import { ImageSelectorModal } from './ImageSelectorModal';
import { 
  X, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Phone, 
  MapPin, 
  Globe, 
  Image as ImageIcon,
  Layout
} from 'lucide-react';

interface NewSiteModalProps {
  templates: BusinessTemplate[];
  initialTemplate?: BusinessTemplate | null;
  onClose: () => void;
  onCreateSite: (siteData: Partial<ClientSite>) => void;
}

export const NewSiteModal: React.FC<NewSiteModalProps> = ({
  templates,
  initialTemplate,
  onClose,
  onCreateSite,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplate?.id || templates[0]?.id || ''
  );
  const [step, setStep] = useState<1 | 2>(initialTemplate ? 2 : 1);

  // Form Fields
  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [phone, setPhone] = useState('0532 000 00 00');
  const [districtCity, setDistrictCity] = useState('Kadıköy, İstanbul');
  const [address, setAddress] = useState('Merkez Mahallesi Atatürk Caddesi No: 12');

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  // Visual & Structure overrides for template
  const [heroImage, setHeroImage] = useState<string>(selectedTemplate.previewImage);
  const [heroLayout, setHeroLayout] = useState<SiteLayout['heroLayout']>('split');
  const [servicesLayout, setServicesLayout] = useState<SiteLayout['servicesLayout']>('cards');
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const handleSelectTemplate = (tpl: BusinessTemplate) => {
    setSelectedTemplateId(tpl.id);
    setHeroImage(tpl.previewImage);
    setHeroLayout(tpl.siteData.layout?.heroLayout || 'split');
    setServicesLayout(tpl.siteData.layout?.servicesLayout || 'cards');
  };

  const handleNameChange = (name: string) => {
    setBusinessName(name);
    // Auto-generate clean slug
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug || 'yeni-musteri-sitesi');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    const baseData = selectedTemplate.siteData;
    const finalPhone = phone.trim() || baseData.generalInfo.phone;
    const cleanDigits = finalPhone.replace(/\D/g, '');
    const whatsappNum = cleanDigits.startsWith('90')
      ? cleanDigits
      : cleanDigits.startsWith('0')
      ? '9' + cleanDigits
      : '90' + cleanDigits;

    const newSite: Partial<ClientSite> = {
      name: businessName.trim(),
      slug: slug.trim() || 'site-' + Date.now(),
      category: selectedTemplate.category,
      categoryLabel: selectedTemplate.categoryLabel,
      status: 'published',
      theme: { ...baseData.theme },
      layout: {
        ...(baseData.layout || {
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
        }),
        heroLayout,
        servicesLayout,
      },
      generalInfo: {
        ...baseData.generalInfo,
        phone: finalPhone,
        whatsapp: whatsappNum,
        address: address.trim() || baseData.generalInfo.address,
        districtCity: districtCity.trim() || baseData.generalInfo.districtCity,
      },
      hero: {
        ...baseData.hero,
        title: `${businessName.trim()} Hizmetinizde`,
        heroImage: heroImage || baseData.hero.heroImage,
      },
      services: [...baseData.services],
      products: [...baseData.products],
      gallery: [...baseData.gallery],
      testimonials: [...baseData.testimonials],
      about: {
        ...baseData.about,
      },
      bookingSettings: {
        ...baseData.bookingSettings,
      },
    };

    onCreateSite(newSite);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <span>Müşteri Sitesi Sihirbazı</span>
              <span aria-hidden="true">·</span>
              <span>{step === 1 ? 'Adım 1: Sektör Şablonu Seç' : 'Adım 2: İşletme Bilgileri & Yapı'}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {step === 1 ? 'Müşterinizin Sektörüne Uygun Şablonu Seçin' : 'Müşteri İşletme ve Görsel Yapısını Belirleyin'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                Seçtiğiniz şablona göre hizmet ve ürün listeleri, randevu formu ve sektörel içerikler otomatik olarak yüklenecektir.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      selectedTemplateId === tpl.id
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="w-16 h-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
                      <img
                        src={tpl.previewImage}
                        alt={tpl.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white truncate">
                          {tpl.title}
                        </span>
                        {selectedTemplateId === tpl.id && (
                          <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-400 line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form id="new-site-form" onSubmit={handleSubmit} className="space-y-5">
              {/* Selected template recap + Quick Image Changer */}
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-12 rounded-lg overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
                    <img
                      src={heroImage}
                      alt={selectedTemplate.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {selectedTemplate.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsImagePickerOpen(true)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-medium underline flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3 h-3" />
                      Görseli Değiştir
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-neutral-400 hover:text-white underline cursor-pointer shrink-0"
                >
                  Şablon Değiştir
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    İşletme / Müşteri Adı *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      placeholder="Örn: Tarihi Taş Değirmen Fırını, Stil Kuaför vb."
                      value={businessName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Site URL Adresi (Slug)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      placeholder="isletme-adi"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    Önizleme linki: site/{slug || 'ad'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Telefon / WhatsApp Hattı
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="0532 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      İlçe ve İl
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Kadıköy, İstanbul"
                        value={districtCity}
                        onChange={(e) => setDistrictCity(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Açık Adres (Cadde / Sokak)
                  </label>
                  <input
                    type="text"
                    placeholder="Bahariye Cad. No: 45/A"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Layout / Structure Presets Picker */}
              <div className="pt-3 border-t border-neutral-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-200">
                  <Layout className="w-3.5 h-3.5 text-amber-400" />
                  <span>Şablonun Açılış ve Menü Yapısı</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Hero Açılış Yapısı</label>
                    <select
                      value={heroLayout}
                      onChange={(e) => setHeroLayout(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="split">Bölünmüş İki Kolon (Standart)</option>
                      <option value="fullscreen">Sinematik Tam Ekran</option>
                      <option value="centered">Merkez Odaklı Kart</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Fiyat Tarifesi Yapısı</label>
                    <select
                      value={servicesLayout}
                      onChange={(e) => setServicesLayout(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="cards">Modern Kart Izgarası</option>
                      <option value="classic-list">Klasik Esnaf Menü Çizelgesi</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <span>Bilgileri & Yapıyı Gir</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Geri
              </button>
              <button
                type="submit"
                form="new-site-form"
                disabled={!businessName.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Siteyi Oluştur ve Yayınla</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Image Picker for Step 2 */}
      {isImagePickerOpen && (
        <ImageSelectorModal
          title="Şablon Kapak Görselini Değiştir"
          currentImageUrl={heroImage}
          onSelectImage={(newUrl) => {
            setHeroImage(newUrl);
            setIsImagePickerOpen(false);
          }}
          onClose={() => setIsImagePickerOpen(false)}
        />
      )}
    </div>
  );
};
