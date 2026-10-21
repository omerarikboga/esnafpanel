import React, { useState } from 'react';
import { BusinessTemplate } from '../../types';
import { 
  Plus, 
  Eye, 
  Sparkles, 
  Check, 
  Layers, 
  Clock, 
  PhoneCall, 
  Calendar,
  Utensils,
  Wrench,
  Scissors
} from 'lucide-react';

interface TemplateCatalogProps {
  templates: BusinessTemplate[];
  onUseTemplate: (template: BusinessTemplate) => void;
  onPreviewTemplate: (template: BusinessTemplate) => void;
}

export const TemplateCatalog: React.FC<TemplateCatalogProps> = ({
  templates,
  onUseTemplate,
  onPreviewTemplate,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filterOptions = [
    { id: 'all', label: 'Tüm Sektör Şablonları' },
    { id: 'barber', label: 'Berber & Kuaför' },
    { id: 'bakery', label: 'Fırın & Unlu Mamüller' },
    { id: 'cafe', label: 'Cafe & Bistro' },
    { id: 'auto', label: 'Oto Servis & Detailing' },
    { id: 'plumber', label: 'Tesisat & Usta' },
  ];

  const filteredTemplates = templates.filter(
    (t) => selectedFilter === 'all' || t.category === selectedFilter
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'barber':
        return <Scissors className="w-4 h-4 text-amber-400" />;
      case 'bakery':
        return <Utensils className="w-4 h-4 text-orange-400" />;
      case 'cafe':
        return <Utensils className="w-4 h-4 text-emerald-400" />;
      case 'auto':
        return <Wrench className="w-4 h-4 text-blue-400" />;
      case 'plumber':
        return <Wrench className="w-4 h-4 text-sky-400" />;
      default:
        return <Layers className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Esnaf & İşletme Hazır Şablon Kütüphanesi
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Farklı meslek grupları için özel olarak hazırlanmış; hizmet listesi, randevu formu ve iletişim altyapısı hazır şablonlar.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedFilter(opt.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === opt.id
                ? 'bg-neutral-800 text-amber-400 border border-neutral-700 shadow-sm'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden flex flex-col justify-between group transition-all"
          >
            <div>
              {/* Image Preview with Badge */}
              <div className="relative aspect-[16/9] w-full bg-neutral-800 overflow-hidden">
                <img
                  src={tpl.previewImage}
                  alt={tpl.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-medium text-amber-400 border border-neutral-800 flex items-center gap-1.5">
                  {getCategoryIcon(tpl.category)}
                  <span>{tpl.categoryLabel}</span>
                </div>

                {tpl.badge && (
                  <div className="absolute top-3 right-3 bg-amber-400 text-neutral-950 font-bold text-[10px] px-2 py-0.5 rounded shadow">
                    {tpl.badge}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {tpl.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Pre-included Features checklist */}
                <div className="pt-2 border-t border-neutral-800 space-y-1.5 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Dinamik Fiyat Tarifesi & Hizmet/Ürün Vitrini</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{tpl.siteData.bookingSettings.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>WhatsApp Doğrudan İletişim & Harita Konumu</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400 text-[11px] pt-1">
                    <span className="font-mono text-amber-400/80">Yapı Modeli:</span>
                    <span>
                      {tpl.siteData.layout?.heroLayout === 'fullscreen'
                        ? 'Sinematik Tam Ekran'
                        : 'Bölünmüş İki Kolon'}
                      {' · '}
                      {tpl.siteData.layout?.servicesLayout === 'classic-list'
                        ? 'Klasik Çizelge'
                        : 'Kart Izgarası'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-neutral-950/60 border-t border-neutral-800 flex items-center gap-2">
              <button
                onClick={() => onPreviewTemplate(tpl)}
                className="flex-1 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Şablonu İncele
              </button>

              <button
                onClick={() => onUseTemplate(tpl)}
                className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Bu Şablonu Kullan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
