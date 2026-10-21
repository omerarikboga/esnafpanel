import React, { useState } from 'react';
import { ClientSite, ServiceItem, ProductItem, TestimonialItem, WorkingHourItem, GalleryItem } from '../../types';
import { ImageSelectorModal } from './ImageSelectorModal';
import { 
  ArrowLeft, 
  Save, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Check, 
  Building2, 
  Clock, 
  Phone, 
  Sparkles, 
  Palette, 
  ListOrdered, 
  Coffee, 
  Star, 
  Info,
  CalendarCheck,
  Layout,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Move
} from 'lucide-react';

interface SiteEditorProps {
  site: ClientSite;
  onSave: (updatedSite: ClientSite) => void;
  onBack: () => void;
  onPreview: (site: ClientSite) => void;
}

type EditorTab = 
  | 'general' 
  | 'layout'
  | 'images'
  | 'hero' 
  | 'services' 
  | 'products' 
  | 'about' 
  | 'testimonials' 
  | 'booking' 
  | 'theme';

export const SiteEditor: React.FC<SiteEditorProps> = ({
  site,
  onSave,
  onBack,
  onPreview,
}) => {
  const [formData, setFormData] = useState<ClientSite>(JSON.parse(JSON.stringify(site)));
  const [activeTab, setActiveTab] = useState<EditorTab>('layout');
  const [savedToast, setSavedToast] = useState(false);

  // Image Selector Modal State
  const [imageModalTarget, setImageModalTarget] = useState<'hero' | 'gallery' | null>(null);

  const handleSave = () => {
    onSave(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  // Section Ordering & Visibility Helpers
  const sectionLabels: Record<string, string> = {
    hero: 'Açılış Manşeti (Hero)',
    services: 'Hizmetler ve Fiyat Tarifesi',
    products: 'Menü ve Ürün Vitrini',
    about: 'İşletme Hikayesi & Hakkımızda',
    gallery: 'Fotoğraf Galerisi',
    testimonials: 'Müşteri Yorumları',
    contact: 'İletişim, Saatler & Randevu Formu',
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const currentOrder = [...formData.layout.sectionsOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;

    setFormData({
      ...formData,
      layout: {
        ...formData.layout,
        sectionsOrder: currentOrder,
      },
    });
  };

  const toggleSectionVisibility = (sectionKey: string) => {
    const currentVis = { ...formData.layout.sectionsVisibility };
    const key = sectionKey as keyof typeof currentVis;
    currentVis[key] = !currentVis[key];

    setFormData({
      ...formData,
      layout: {
        ...formData.layout,
        sectionsVisibility: currentVis,
      },
    });
  };

  // Gallery Helpers
  const addGalleryImage = (imageUrl: string) => {
    const newItem: GalleryItem = {
      id: 'gal_' + Date.now(),
      title: 'İşletme Görseli',
      category: 'Genel',
      imageUrl,
    };
    setFormData({
      ...formData,
      gallery: [...formData.gallery, newItem],
    });
  };

  const removeGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      gallery: formData.gallery.filter((_, i) => i !== index),
    });
  };

  // Service Helpers
  const addService = () => {
    const newService: ServiceItem = {
      id: 'srv_' + Date.now(),
      name: 'Yeni Hizmet',
      category: 'Genel',
      description: 'Hizmet detay açıklaması buraya yazılacaktır.',
      price: '250 ₺',
      duration: '30 dk',
      featured: false,
    };
    setFormData({
      ...formData,
      services: [...formData.services, newService],
    });
  };

  const updateService = (index: number, field: keyof ServiceItem, value: any) => {
    const updated = [...formData.services];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, services: updated });
  };

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index),
    });
  };

  // Product Helpers
  const addProduct = () => {
    const newProduct: ProductItem = {
      id: 'prd_' + Date.now(),
      name: 'Yeni Ürün / Lezzet',
      category: 'Genel',
      price: '50 ₺',
      description: 'Ürün açıklaması buraya gelecektir.',
      tag: 'Taze',
    };
    setFormData({
      ...formData,
      products: [...formData.products, newProduct],
    });
  };

  const updateProduct = (index: number, field: keyof ProductItem, value: any) => {
    const updated = [...formData.products];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, products: updated });
  };

  const removeProduct = (index: number) => {
    setFormData({
      ...formData,
      products: formData.products.filter((_, i) => i !== index),
    });
  };

  // Working Hours Helpers
  const addWorkingHour = () => {
    const newHour: WorkingHourItem = {
      days: 'Cumartesi - Pazar',
      hours: '09:00 - 20:00',
    };
    setFormData({
      ...formData,
      generalInfo: {
        ...formData.generalInfo,
        workingHours: [...formData.generalInfo.workingHours, newHour],
      },
    });
  };

  const updateWorkingHour = (index: number, field: keyof WorkingHourItem, value: any) => {
    const updated = [...formData.generalInfo.workingHours];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      generalInfo: {
        ...formData.generalInfo,
        workingHours: updated,
      },
    });
  };

  const removeWorkingHour = (index: number) => {
    setFormData({
      ...formData,
      generalInfo: {
        ...formData.generalInfo,
        workingHours: formData.generalInfo.workingHours.filter((_, i) => i !== index),
      },
    });
  };

  // Testimonial Helpers
  const addTestimonial = () => {
    const newTestimonial: TestimonialItem = {
      id: 't_' + Date.now(),
      author: 'Müşteri Adı',
      roleOrLocation: 'İl / Semt',
      comment: 'İşletmeden aldığım hizmetten son derece memnun kaldım.',
      rating: 5,
      date: 'Yeni',
    };
    setFormData({
      ...formData,
      testimonials: [...formData.testimonials, newTestimonial],
    });
  };

  const updateTestimonial = (index: number, field: keyof TestimonialItem, value: any) => {
    const updated = [...formData.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, testimonials: updated });
  };

  const removeTestimonial = (index: number) => {
    setFormData({
      ...formData,
      testimonials: formData.testimonials.filter((_, i) => i !== index),
    });
  };

  const tabs = [
    { id: 'layout', label: 'Sayfa Yapısı & Düzen', icon: Layout },
    { id: 'images', label: `Görseller & Galeri (${formData.gallery.length})`, icon: ImageIcon },
    { id: 'hero', label: 'Hero (Açılış)', icon: Sparkles },
    { id: 'services', label: `Hizmetler (${formData.services.length})`, icon: ListOrdered },
    { id: 'products', label: `Ürün / Menü (${formData.products.length})`, icon: Coffee },
    { id: 'about', label: 'Hakkımızda', icon: Info },
    { id: 'testimonials', label: `Yorumlar (${formData.testimonials.length})`, icon: Star },
    { id: 'general', label: 'İşletme & İletişim', icon: Building2 },
    { id: 'booking', label: 'Randevu Formu', icon: CalendarCheck },
    { id: 'theme', label: 'Tema & Renk', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Sitelerime Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
                {formData.name}
              </h1>
              <span
                onClick={() =>
                  setFormData({
                    ...formData,
                    status: formData.status === 'published' ? 'draft' : 'published',
                  })
                }
                className={`text-[11px] px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                  formData.status === 'published'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'
                }`}
                title="Tıklayarak durumu değiştirin"
              >
                {formData.status === 'published' ? '● Yayında (Canlı)' : '○ Taslak'}
              </span>
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              Link: /{formData.slug}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onPreview(formData)}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            Müşteri Sitesini Gör
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer active:scale-95"
          >
            {savedToast ? <Check className="w-4 h-4 text-neutral-950" /> : <Save className="w-4 h-4" />}
            {savedToast ? 'Değişiklikler Kaydedildi!' : 'Kaydet & Yayınla'}
          </button>
        </div>
      </div>

      {/* Editor Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-neutral-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as EditorTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                isActive
                  ? 'bg-neutral-900 text-amber-400 border-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-white border-transparent hover:bg-neutral-900/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        {/* TAB: SAYFA YAPISI & DÜZEN */}
        {activeTab === 'layout' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-base font-bold text-white">Web Sitesi Yapı ve Düzen Ayarları</h2>
              <p className="text-xs text-neutral-400">
                Bölümlerin sayfa üzerindeki sıralamasını değiştirin, istediğiniz alanları gizleyin veya şablonun görsel yapısını seçin.
              </p>
            </div>

            {/* Bölüm Sıralaması & Aç/Kapa */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Move className="w-4 h-4 text-amber-400" />
                <span>Bölüm Sıralaması ve Görünürlük Kontrolü</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Bölümleri yukarı/aşağı taşıyarak sitenin akışını yeniden düzenleyin veya ziyaretçiye gösterilmeyen bölümleri kapatın.
              </p>

              <div className="space-y-2 max-w-xl">
                {formData.layout.sectionsOrder.map((secKey, idx) => {
                  const isVisible = (formData.layout.sectionsVisibility as any)[secKey] ?? true;
                  return (
                    <div
                      key={secKey}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                        isVisible
                          ? 'bg-neutral-950 border-neutral-800 text-white'
                          : 'bg-neutral-950/40 border-neutral-850 text-neutral-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-neutral-500 w-5 text-right">
                          {idx + 1}.
                        </span>
                        <span className="text-xs font-semibold">
                          {sectionLabels[secKey] || secKey}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded hover:bg-neutral-800 cursor-pointer"
                          title="Yukarı Taşı"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => moveSection(idx, 'down')}
                          disabled={idx === formData.layout.sectionsOrder.length - 1}
                          className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded hover:bg-neutral-800 cursor-pointer"
                          title="Aşağı Taşı"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility(secKey)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            isVisible
                              ? 'text-emerald-400 hover:bg-emerald-500/10'
                              : 'text-neutral-500 hover:text-white hover:bg-neutral-800'
                          }`}
                          title={isVisible ? 'Bölümü Gizle' : 'Bölümü Göster'}
                        >
                          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hero Alanı Yapı Modeli */}
            <div className="pt-6 border-t border-neutral-800 space-y-3">
              <h3 className="text-sm font-semibold text-white">Hero (Açılış Manşeti) Yapı Modeli</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'split',
                    title: 'Bölünmüş İki Kolon',
                    desc: 'Solda manşet & butonlar, sağda büyük çerçeveli görsel (Standart)',
                  },
                  {
                    id: 'fullscreen',
                    title: 'Sinematik Tam Ekran',
                    desc: 'Görsel tüm arka planı kaplar, üzerinde ortalanmış başlık & filtre',
                  },
                  {
                    id: 'centered',
                    title: 'Merkez Odaklı Kart',
                    desc: 'Ortalanmış manşet metni ve altında geniş vitrin fotoğrafı',
                  },
                ].map((hl) => (
                  <div
                    key={hl.id}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        layout: { ...formData.layout, heroLayout: hl.id as any },
                      })
                    }
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.layout.heroLayout === hl.id
                        ? 'bg-neutral-800 border-amber-400 ring-1 ring-amber-400/20'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">{hl.title}</span>
                    <span className="text-[11px] text-neutral-400 block mt-1">{hl.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hizmetler ve Fiyat Yapısı */}
            <div className="pt-6 border-t border-neutral-800 space-y-3">
              <h3 className="text-sm font-semibold text-white">Hizmetler & Fiyat Tarifesi Görünüm Stili</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'cards',
                    title: 'Modern Kart Izgarası',
                    desc: 'Her hizmet ayrı modern kutu içerisinde fiyat ve randevu butonuyla',
                  },
                  {
                    id: 'classic-list',
                    title: 'Klasik Berber / Esnaf Menü Çizelgesi',
                    desc: 'Geleneksel noktalı lider çizgili fiyat listesi (Fiyat Tarifesi Panosu)',
                  },
                ].map((sl) => (
                  <div
                    key={sl.id}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        layout: { ...formData.layout, servicesLayout: sl.id as any },
                      })
                    }
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.layout.servicesLayout === sl.id
                        ? 'bg-neutral-800 border-amber-400 ring-1 ring-amber-400/20'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">{sl.title}</span>
                    <span className="text-[11px] text-neutral-400 block mt-1">{sl.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Menü / Ürünler Görünüm Stili */}
            <div className="pt-6 border-t border-neutral-800 space-y-3">
              <h3 className="text-sm font-semibold text-white">Menü & Ürünler Görünüm Stili</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'grid',
                    title: '3 Kolonlu Vitrin Izgarası',
                    desc: 'Görsel veya kart kutucuklarıyla zengin ürün sergileme',
                  },
                  {
                    id: 'compact-list',
                    title: 'Kompakt Kafe / Fırın Menü Listesi',
                    desc: 'Temiz liste düzeni, fiyatlar ve kategori başlıkları',
                  },
                ].map((pl) => (
                  <div
                    key={pl.id}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        layout: { ...formData.layout, productsLayout: pl.id as any },
                      })
                    }
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.layout.productsLayout === pl.id
                        ? 'bg-neutral-800 border-amber-400 ring-1 ring-amber-400/20'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">{pl.title}</span>
                    <span className="text-[11px] text-neutral-400 block mt-1">{pl.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: GÖRSELLER & GALERİ */}
        {activeTab === 'images' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-base font-bold text-white">Görseller ve Fotoğraf Galerisi</h2>
              <p className="text-xs text-neutral-400">
                Açılış (Hero) kapak görselini değiştirin ve sitenizin fotoğraf galerisini yönetin.
              </p>
            </div>

            {/* 1. Hero / Kapak Fotoğrafı */}
            <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Ana Sayfa Kapak (Hero) Görseli</h3>
                  <p className="text-xs text-neutral-400">Ziyaretçiyi ilk karşılayan yüksek çözünürlüklü tanıtım fotoğrafı</p>
                </div>
                <button
                  type="button"
                  onClick={() => setImageModalTarget('hero')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Görseli Değiştir
                </button>
              </div>

              <div className="relative aspect-[16/9] max-h-72 w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
                <img
                  src={formData.hero.heroImage}
                  alt={formData.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs text-neutral-200">Mevcut Kapak Görseli</span>
                </div>
              </div>
            </div>

            {/* 2. Galeri Fotoğrafları */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Fotoğraf Galerisi ({formData.gallery.length})</h3>
                  <p className="text-xs text-neutral-400">İşletme içi, ürünler ve referans çalışma fotoğrafları</p>
                </div>
                <button
                  type="button"
                  onClick={() => setImageModalTarget('gallery')}
                  className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Galeriye Fotoğraf Ekle
                </button>
              </div>

              {formData.gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.gallery.map((item, idx) => (
                    <div
                      key={item.id}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                        <span className="text-[11px] text-white truncate max-w-[80%]">
                          {item.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="p-1 bg-rose-500/80 hover:bg-rose-500 text-white rounded cursor-pointer transition-colors"
                          title="Fotoğrafı Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-3">
                  <ImageIcon className="w-8 h-8 text-neutral-500 mx-auto" />
                  <p className="text-xs text-neutral-400">
                    Henüz galeriye fotoğraf eklenmemiş. Yukarıdaki butona tıklayarak hazır sektör fotoğraflarından veya bilgisayarınızdan ekleyebilirsiniz.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: GENEL BİLGİLER & İLETİŞİM */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">İşletme Temel Bilgileri</h2>
              <p className="text-xs text-neutral-400">Web sitesinde görünecek genel iletişim ve lokasyon bilgileri</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  İşletme Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Site Bağlantı Adı (Slug)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Slogan & Tanıtım Cümlesi
                </label>
                <input
                  type="text"
                  value={formData.generalInfo.tagline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      generalInfo: { ...formData.generalInfo, tagline: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Telefon Numarası
                </label>
                <input
                  type="text"
                  value={formData.generalInfo.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      generalInfo: { ...formData.generalInfo, phone: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  WhatsApp Numarası (Ülke kodu ile, örn: 905321112233)
                </label>
                <input
                  type="text"
                  value={formData.generalInfo.whatsapp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      generalInfo: { ...formData.generalInfo, whatsapp: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  İlçe / İl (Bölge)
                </label>
                <input
                  type="text"
                  value={formData.generalInfo.districtCity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      generalInfo: { ...formData.generalInfo, districtCity: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Açık Adres (Navigasyon & Harita)
                </label>
                <input
                  type="text"
                  value={formData.generalInfo.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      generalInfo: { ...formData.generalInfo, address: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Çalışma Saatleri */}
            <div className="pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">Çalışma Saatleri & Nöbetler</h3>
                  <p className="text-xs text-neutral-400">Müşterilerin dükkanı açık bulacağı gün ve saatler</p>
                </div>
                <button
                  type="button"
                  onClick={addWorkingHour}
                  className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Saat Ekle
                </button>
              </div>

              <div className="space-y-2">
                {formData.generalInfo.workingHours.map((wh, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-neutral-950 p-2 rounded-lg border border-neutral-800"
                  >
                    <input
                      type="text"
                      placeholder="Günler (Örn: Hafta İçi, Pazar)"
                      value={wh.days}
                      onChange={(e) => updateWorkingHour(idx, 'days', e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-750 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Saatler (Örn: 08:30 - 20:00)"
                      value={wh.hours}
                      onChange={(e) => updateWorkingHour(idx, 'hours', e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-750 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => removeWorkingHour(idx)}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERO & ANA SAYFA */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Açılış (Hero) Alanı</h2>
                <p className="text-xs text-neutral-400">Ziyaretçiyi karşılayan ana manşet, butonlar ve görsel</p>
              </div>
              <button
                type="button"
                onClick={() => setImageModalTarget('hero')}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Hero Görselini Değiştir
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Üst Rozet / Vurgu Metni
                </label>
                <input
                  type="text"
                  value={formData.hero.badgeText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, badgeText: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Ana Manşet Başlığı (H1)
                </label>
                <input
                  type="text"
                  value={formData.hero.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, title: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Alt Açıklama Paragrafı
                </label>
                <textarea
                  rows={3}
                  value={formData.hero.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Birincil Buton Metni
                  </label>
                  <input
                    type="text"
                    value={formData.hero.primaryCtaText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, primaryCtaText: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    İkincil Buton Metni
                  </label>
                  <input
                    type="text"
                    value={formData.hero.secondaryCtaText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, secondaryCtaText: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Öne Çıkan Özellik Maddeleri */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Öne Çıkan 3 Madde (Tik işaretli özellikler)
                </label>
                <div className="space-y-2">
                  {formData.hero.features.map((feat, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const newFeats = [...formData.hero.features];
                        newFeats[idx] = e.target.value;
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, features: newFeats },
                        });
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HİZMETLER & FİYAT LİSTESİ */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Hizmetler ve Fiyat Tarifesi</h2>
                <p className="text-xs text-neutral-400">Kuaför saç kesimi, araç seramik kaplama, usta tamir bedelleri vb.</p>
              </div>
              <button
                type="button"
                onClick={addService}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Yeni Hizmet Ekle
              </button>
            </div>

            <div className="space-y-3">
              {formData.services.map((srv, idx) => (
                <div
                  key={srv.id}
                  className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-neutral-500">#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Sil
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-neutral-400 mb-1">Hizmet Adı</label>
                      <input
                        type="text"
                        value={srv.name}
                        onChange={(e) => updateService(idx, 'name', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Fiyat / Ücret</label>
                      <input
                        type="text"
                        value={srv.price}
                        onChange={(e) => updateService(idx, 'price', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-amber-400 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Süre / Zaman (Opsiyonel)</label>
                      <input
                        type="text"
                        placeholder="Örn: 45 dk, 1 Gün"
                        value={srv.duration || ''}
                        onChange={(e) => updateService(idx, 'duration', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Kategori</label>
                      <input
                        type="text"
                        placeholder="Saç, Sakal, Bakım vb."
                        value={srv.category || ''}
                        onChange={(e) => updateService(idx, 'category', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Açıklama</label>
                    <input
                      type="text"
                      value={srv.description}
                      onChange={(e) => updateService(idx, 'description', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ÜRÜNLER / MENÜ */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Ürün Vitrini ve Menü</h2>
                <p className="text-xs text-neutral-400">Fırın ekmekleri, pastalar, kahveler veya özel paket ürünler</p>
              </div>
              <button
                type="button"
                onClick={addProduct}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Yeni Ürün Ekle
              </button>
            </div>

            <div className="space-y-3">
              {formData.products.map((prd, idx) => (
                <div
                  key={prd.id}
                  className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-neutral-500">#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeProduct(idx)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Sil
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-neutral-400 mb-1">Ürün / Lezzet Adı</label>
                      <input
                        type="text"
                        value={prd.name}
                        onChange={(e) => updateProduct(idx, 'name', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Fiyat</label>
                      <input
                        type="text"
                        value={prd.price}
                        onChange={(e) => updateProduct(idx, 'price', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-amber-400 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Kategori (Ekmek, Simit, Kahve vb.)</label>
                      <input
                        type="text"
                        value={prd.category}
                        onChange={(e) => updateProduct(idx, 'category', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Öne Çıkan Etiket (Opsiyonel)</label>
                      <input
                        type="text"
                        placeholder="Örn: En Çok Satan, Sıcak Çıktı"
                        value={prd.tag || ''}
                        onChange={(e) => updateProduct(idx, 'tag', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Açıklama / Malzeme Detayı</label>
                    <input
                      type="text"
                      value={prd.description}
                      onChange={(e) => updateProduct(idx, 'description', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: HAKKIMIZDA & HİKAYE */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">İşletme Hikayesi & Güven Vurguları</h2>
              <p className="text-xs text-neutral-400">Esnafın köklü geçmişi, ustalık yılları ve başarı sayıları</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Bölüm Başlığı
                </label>
                <input
                  type="text"
                  value={formData.about.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, title: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Ustalık / Deneyim Yılı (Örn: 20 Yıl, 1978den beri)
                </label>
                <input
                  type="text"
                  value={formData.about.experienceYears}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, experienceYears: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  İşletme Hikayesi Paragrafı
                </label>
                <textarea
                  rows={4}
                  value={formData.about.story}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, story: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Highlights numbers */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  İstatistik Sayıları (Örn: 15.000+ Müşteri, %99 Memnuniyet)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {formData.about.highlights.map((hl, idx) => (
                    <div key={idx} className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 space-y-2">
                      <input
                        type="text"
                        placeholder="Değer (Örn: 15.000+)"
                        value={hl.value}
                        onChange={(e) => {
                          const updated = [...formData.about.highlights];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          setFormData({
                            ...formData,
                            about: { ...formData.about, highlights: updated },
                          });
                        }}
                        className="w-full bg-neutral-900 border border-neutral-750 rounded px-2 py-1 text-xs text-amber-400 font-mono font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Etiket (Örn: Memnun Müşteri)"
                        value={hl.label}
                        onChange={(e) => {
                          const updated = [...formData.about.highlights];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setFormData({
                            ...formData,
                            about: { ...formData.about, highlights: updated },
                          });
                        }}
                        className="w-full bg-neutral-900 border border-neutral-750 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MÜŞTERİ YORUMLARI */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Müşteri Yorumları & Değerlendirmeler</h2>
                <p className="text-xs text-neutral-400">Google Haritalar veya gerçek müşteri tavsiyeleri</p>
              </div>
              <button
                type="button"
                onClick={addTestimonial}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Yeni Yorum Ekle
              </button>
            </div>

            <div className="space-y-3">
              {formData.testimonials.map((t, idx) => (
                <div
                  key={t.id}
                  className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-400 font-mono">({t.rating} / 5)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTestimonial(idx)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Sil
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Müşteri Adı</label>
                      <input
                        type="text"
                        value={t.author}
                        onChange={(e) => updateTestimonial(idx, 'author', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Semt / Bölge / Ünvan</label>
                      <input
                        type="text"
                        value={t.roleOrLocation}
                        onChange={(e) => updateTestimonial(idx, 'roleOrLocation', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Yorum Metni</label>
                    <textarea
                      rows={2}
                      value={t.comment}
                      onChange={(e) => updateTestimonial(idx, 'comment', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: RANDEVU & TALEP FORMU AYARLARI */}
        {activeTab === 'booking' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Online Randevu / Sipariş / Teklif Formu</h2>
              <p className="text-xs text-neutral-400">Web sitesi ziyaretçilerinin dolduracağı iletişim ve randevu motoru</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="bookingEnabled"
                  checked={formData.bookingSettings.enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bookingSettings: {
                        ...formData.bookingSettings,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-neutral-950 border-neutral-700"
                />
                <label htmlFor="bookingEnabled" className="text-xs font-medium text-white cursor-pointer">
                  Ziyaretçi Randevu & Sipariş Formu Sitede Aktif Olsun
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Form Tipi
                  </label>
                  <select
                    value={formData.bookingSettings.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bookingSettings: {
                          ...formData.bookingSettings,
                          type: e.target.value as any,
                        },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="appointment">Randevu Alma Formu (Berber, Kuaför, Cafe)</option>
                    <option value="order">Toplu Sipariş Formu (Fırın, Pastane)</option>
                    <option value="quote">Ücretsiz Keşif / Fiyat Teklifi (Tesisat, Oto Bakım)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Gönder Buton Metni
                  </label>
                  <input
                    type="text"
                    value={formData.bookingSettings.buttonLabel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bookingSettings: {
                          ...formData.bookingSettings,
                          buttonLabel: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Form Başlığı
                </label>
                <input
                  type="text"
                  value={formData.bookingSettings.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bookingSettings: {
                        ...formData.bookingSettings,
                        title: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Form Alt Açıklaması
                </label>
                <input
                  type="text"
                  value={formData.bookingSettings.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bookingSettings: {
                        ...formData.bookingSettings,
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Başarılı Gönderim Teşekkür Mesajı
                </label>
                <input
                  type="text"
                  value={formData.bookingSettings.confirmationText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bookingSettings: {
                        ...formData.bookingSettings,
                        confirmationText: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: TEMA & TASARIM */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Tasarım, Renk & Tipografi</h2>
              <p className="text-xs text-neutral-400">İşletme kimliğine uygun renk paleti ve yazı karakteri</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  Renk Teması Paleti
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'amber-artisan', label: 'Kehribar & Zanaat (Berber/Fırın)', color: '#d97706', accent: '#f59e0b' },
                    { id: 'emerald-fresh', label: 'Zümrüt Yeşili (Cafe/Taze)', color: '#059669', accent: '#10b981' },
                    { id: 'navy-corporate', label: 'Derin Mavi (Oto/Tesisat/Servis)', color: '#2563eb', accent: '#3b82f6' },
                    { id: 'dark-slate', label: 'Koyu Grafit / Premium', color: '#475569', accent: '#94a3b8' },
                    { id: 'rose-boutique', label: 'Gül Kurusu & Butik', color: '#e11d48', accent: '#fb7185' },
                  ].map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          theme: {
                            ...formData.theme,
                            themePreset: preset.id as any,
                            primaryColor: preset.color,
                            accentColor: preset.accent,
                          },
                        })
                      }
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        formData.theme.themePreset === preset.id
                          ? 'bg-neutral-800 border-amber-400'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span className="text-xs font-medium text-white truncate">
                        {preset.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  Yazı Tipi & Başlık Stili
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'modern', label: 'Modern Sans (Plus Jakarta)', desc: 'Net ve çağdaş' },
                    { id: 'serif', label: 'Zarif Serif (Playfair)', desc: 'Geleneksel ve prestijli' },
                    { id: 'sans', label: 'Dinamik Çağdaş', desc: 'Hızlı ve okunaklı' },
                  ].map((font) => (
                    <div
                      key={font.id}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          theme: { ...formData.theme, fontStyle: font.id as any },
                        })
                      }
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.theme.fontStyle === font.id
                          ? 'bg-neutral-800 border-amber-400'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-xs font-semibold text-white block">
                        {font.label}
                      </span>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">
                        {font.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Selector Modal */}
      {imageModalTarget && (
        <ImageSelectorModal
          title={
            imageModalTarget === 'hero'
              ? 'Hero Kapak Görselini Değiştir'
              : 'Fotoğraf Galerisine Yeni Resim Ekle'
          }
          currentImageUrl={
            imageModalTarget === 'hero' ? formData.hero.heroImage : undefined
          }
          onSelectImage={(newUrl) => {
            if (imageModalTarget === 'hero') {
              setFormData({
                ...formData,
                hero: { ...formData.hero, heroImage: newUrl },
              });
            } else if (imageModalTarget === 'gallery') {
              addGalleryImage(newUrl);
            }
            setImageModalTarget(null);
          }}
          onClose={() => setImageModalTarget(null)}
        />
      )}
    </div>
  );
};
