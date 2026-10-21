import React from 'react';
import { ClientSite, LeadSubmission, BusinessTemplate } from '../../types';
import { 
  Globe, 
  CheckCircle2, 
  Eye, 
  Inbox, 
  ExternalLink, 
  Edit3, 
  Plus, 
  Layers, 
  Clock, 
  ArrowRight,
  PhoneCall,
  MessageSquare
} from 'lucide-react';

interface DashboardOverviewProps {
  sites: ClientSite[];
  submissions: LeadSubmission[];
  templates: BusinessTemplate[];
  onSelectSite: (site: ClientSite) => void;
  onPreviewSite: (site: ClientSite) => void;
  onNewSite: () => void;
  onUseTemplate: (template: BusinessTemplate) => void;
  onGoToTab: (tab: 'sites' | 'templates' | 'inbox') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  sites,
  submissions,
  templates,
  onSelectSite,
  onPreviewSite,
  onNewSite,
  onUseTemplate,
  onGoToTab,
}) => {
  const publishedCount = sites.filter((s) => s.status === 'published').length;
  const totalViews = sites.reduce((sum, s) => sum + (s.viewsCount || 0), 0);
  const pendingInquiries = submissions.filter((sub) => sub.status === 'new').length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-amber-400 font-medium mb-2">
            <span>Çoklu Müşteri Yönetim Merkezi</span>
            <span aria-hidden="true">·</span>
            <span>Esnaf & KOBİ Şablon Motoru</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
            Tüm Müşteri Sitelerinizi Tek Merkezden Yayınlayın & Yönetin
          </h1>
          <p className="mt-2 text-sm text-neutral-400 max-w-2xl">
            Berber, fırın, cafe, oto servis ve usta müşterileriniz için 30 saniyede hazır şablon siteleri devreye alın; içerikleri, fiyat listelerini ve gelen randevu taleplerini buradan yönetin.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewSite}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Yeni Müşteri Ekle
          </button>
          <button
            onClick={() => onGoToTab('templates')}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg border border-neutral-700 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            Şablonları İncele
          </button>
        </div>
      </div>

      {/* KPI Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Toplam Müşteri Sitesi</span>
            <Globe className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-3xl font-bold text-white font-mono tabular-nums">
            {sites.length}
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            Farklı sektör ve esnaf portföyü
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Yayındaki Canlı Siteler</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-mono tabular-nums">
            {publishedCount}
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            Aktif ziyaretçi kabul eden siteler
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Toplam Ziyaretçi</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono tabular-nums">
            {totalViews.toLocaleString('tr-TR')}
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            Tüm siteler toplam sayfa görüntüleme
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Gelen Talepler & Randevular</span>
            <Inbox className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400 font-mono tabular-nums">
              {submissions.length}
            </span>
            {pendingInquiries > 0 && (
              <span className="text-xs font-mono text-amber-300">
                ({pendingInquiries} yeni)
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            Müşteri formlarından gelen dönüşümler
          </div>
        </div>
      </div>

      {/* Hazır Sektör Şablonları Hızlı Başlat Çubuğu */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Hazır Sektör Şablonları</h2>
            <p className="text-xs text-neutral-400">Tek tıkla yeni müşterinize ait profesyonel siteyi oluşturun</p>
          </div>
          <button
            onClick={() => onGoToTab('templates')}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            Tüm Şablonları Gör ({templates.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.slice(0, 4).map((tpl) => (
            <div
              key={tpl.id}
              className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-800">
                <img
                  src={tpl.previewImage}
                  alt={tpl.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 bg-neutral-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-medium text-amber-400 border border-neutral-700">
                  {tpl.categoryLabel}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                    {tpl.description}
                  </p>
                </div>

                <button
                  onClick={() => onUseTemplate(tpl)}
                  className="mt-4 w-full py-2 bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Bu Şablonla Site Başlat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* İki Kolonlu Alt Panel: Aktif Siteler & Son Gelen Talepler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Kolon: Müşteri Siteleri Listesi (2 col) */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
            <div>
              <h2 className="text-base font-semibold text-white">Müşteri Sitelerim</h2>
              <p className="text-xs text-neutral-400">Yönettiğiniz esnaf ve işletme portföyü</p>
            </div>
            <button
              onClick={() => onGoToTab('sites')}
              className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Tümünü Yönet ({sites.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-800/60">
            {sites.map((site) => (
              <div
                key={site.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-neutral-800/30 px-2 rounded-lg transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white truncate">
                      {site.name}
                    </span>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${
                        site.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {site.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                    <span>{site.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{site.viewsCount || 0} Görüntüleme</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums text-amber-400/90">{site.inquiryCount || 0} Talep</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onPreviewSite(site)}
                    title="Müşteri Sitesini Gör"
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSelectSite(site)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    İçeriği Düzenle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Kolon: Son Gelen Talepler & Randevular (1 col) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
              <div>
                <h2 className="text-base font-semibold text-white">Son Gelen Talepler</h2>
                <p className="text-xs text-neutral-400">Web sitelerinden gelen dönüşümler</p>
              </div>
              <button
                onClick={() => onGoToTab('inbox')}
                className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Gelen Kutusu
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {submissions.slice(0, 4).map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-lg text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-200">{sub.customerName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        sub.status === 'new'
                          ? 'bg-amber-500/20 text-amber-300'
                          : sub.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {sub.status === 'new' ? 'Yeni Talep' : 'Onaylandı'}
                    </span>
                  </div>

                  <div className="text-neutral-400 truncate">
                    {sub.siteName}
                  </div>

                  {sub.serviceRequested && (
                    <div className="text-neutral-300 font-medium truncate">
                      {sub.serviceRequested}
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between text-neutral-500 text-[11px]">
                    <span className="flex items-center gap-1 font-mono">
                      <PhoneCall className="w-3 h-3 text-neutral-400" />
                      {sub.customerPhone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sub.requestedDate || 'Tarihsiz'}
                    </span>
                  </div>
                </div>
              ))}

              {submissions.length === 0 && (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  Henüz gelen randevu veya talep bulunmuyor.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800">
            <button
              onClick={() => onGoToTab('inbox')}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Tüm Talepleri ve WhatsApp Yanıtlarını Gör
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
