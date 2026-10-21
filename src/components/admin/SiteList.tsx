import React, { useState } from 'react';
import { ClientSite, BusinessCategory } from '../../types';
import { 
  Search, 
  ExternalLink, 
  Edit3, 
  Copy, 
  Trash2, 
  Check, 
  Plus, 
  Eye, 
  Inbox, 
  Sparkles,
  Share2,
  Calendar
} from 'lucide-react';

interface SiteListProps {
  sites: ClientSite[];
  onSelectSite: (site: ClientSite) => void;
  onPreviewSite: (site: ClientSite) => void;
  onDuplicateSite: (site: ClientSite) => void;
  onDeleteSite: (id: string) => void;
  onToggleStatus: (site: ClientSite) => void;
  onNewSite: () => void;
}

export const SiteList: React.FC<SiteListProps> = ({
  sites,
  onSelectSite,
  onPreviewSite,
  onDuplicateSite,
  onDeleteSite,
  onToggleStatus,
  onNewSite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tüm Sektörler' },
    { id: 'barber', label: 'Berber & Kuaför' },
    { id: 'bakery', label: 'Fırın & Pastane' },
    { id: 'cafe', label: 'Cafe & Bistro' },
    { id: 'auto', label: 'Oto Servis & Detailing' },
    { id: 'plumber', label: 'Tesisat & Usta' },
  ];

  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.generalInfo.districtCity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || site.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = (site: ClientSite) => {
    const url = `${window.location.origin}/#site=${site.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(site.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Müşteri Siteleri ({sites.length})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Tüm müşterilerinizin yayındaki web sitelerini, içeriklerini ve durumlarını tek panelden yönetin.
          </p>
        </div>

        <button
          onClick={onNewSite}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yeni Müşteri Sitesi Oluştur
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İşletme adı, adres veya link ara..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Category Pills (Functional filter buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700 shadow-sm'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sites Grid */}
      {filteredSites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSites.map((site) => (
            <div
              key={site.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Cover */}
                <div className="relative aspect-[16/9] w-full bg-neutral-800 overflow-hidden">
                  <img
                    src={site.hero.heroImage}
                    alt={site.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  {/* Category & Status Overlay */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                    <span className="bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-medium text-amber-400 border border-neutral-800">
                      {site.categoryLabel}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => onToggleStatus(site)}
                      title="Durumu Değiştirmek İçin Tıklayın"
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer backdrop-blur-md border ${
                        site.status === 'published'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900'
                          : 'bg-neutral-950/80 text-neutral-400 border-neutral-800 hover:bg-neutral-800'
                      }`}
                    >
                      {site.status === 'published' ? '● Yayında' : '○ Taslak'}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {site.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-neutral-400 line-clamp-1">
                      {site.generalInfo.tagline}
                    </p>
                  </div>

                  {/* Slug & Location */}
                  <div className="text-[11px] text-neutral-500 space-y-1">
                    <div className="flex items-center gap-1.5 font-mono text-neutral-400 truncate">
                      <span>/{site.slug}</span>
                    </div>
                    <div className="truncate">
                      📍 {site.generalInfo.districtCity}
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="font-mono tabular-nums">{site.viewsCount || 0}</span>
                      <span className="text-neutral-500 text-[11px]">görüntüleme</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Inbox className="w-3.5 h-3.5 text-amber-500/80" />
                      <span className="font-mono tabular-nums font-semibold text-amber-400">
                        {site.inquiryCount || 0}
                      </span>
                      <span className="text-neutral-500 text-[11px]">talep</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3 bg-neutral-950/60 border-t border-neutral-800 flex items-center justify-between gap-1">
                <button
                  onClick={() => onPreviewSite(site)}
                  className="flex-1 py-1.5 px-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Müşteri Sitesini Gör"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Siteyi Aç
                </button>

                <button
                  onClick={() => onSelectSite(site)}
                  className="flex-1 py-1.5 px-2 bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-neutral-950 border border-amber-500/30 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="İçerikleri Düzenle"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  CMS Düzenle
                </button>

                <button
                  onClick={() => handleCopyLink(site)}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                  title="Site Bağlantısını Kopyala"
                >
                  {copiedId === site.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => onDuplicateSite(site)}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                  title="Siteyi Çoğalt (Kopya)"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`"${site.name}" sitesini silmek istediğinize emin misiniz?`)) {
                      onDeleteSite(site.id);
                    }
                  }}
                  className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                  title="Siteyi Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Eşleşen Müşteri Sitesi Bulunamadı</h3>
            <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
              Arama kriterlerinize uyan site bulunamadı. Aramanızı temizleyebilir veya yeni bir müşteri sitesi oluşturabilirsiniz.
            </p>
          </div>
          <button
            onClick={onNewSite}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Yeni Müşteri Sitesi Oluştur
          </button>
        </div>
      )}
    </div>
  );
};
