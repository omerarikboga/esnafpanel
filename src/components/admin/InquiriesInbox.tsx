import React, { useState } from 'react';
import { LeadSubmission, ClientSite } from '../../types';
import { 
  Inbox, 
  Search, 
  PhoneCall, 
  MessageSquare, 
  Check, 
  Trash2, 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Filter
} from 'lucide-react';

interface InquiriesInboxProps {
  submissions: LeadSubmission[];
  sites: ClientSite[];
  onUpdateStatus: (id: string, status: LeadSubmission['status']) => void;
  onDeleteSubmission: (id: string) => void;
}

export const InquiriesInbox: React.FC<InquiriesInboxProps> = ({
  submissions,
  sites,
  onUpdateStatus,
  onDeleteSubmission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.customerPhone.includes(searchQuery) ||
      (sub.serviceRequested && sub.serviceRequested.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sub.notes && sub.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSite = selectedSiteId === 'all' || sub.siteId === selectedSiteId;
    const matchesStatus = selectedStatus === 'all' || sub.status === selectedStatus;

    return matchesSearch && matchesSite && matchesStatus;
  });

  const getWhatsAppLink = (sub: LeadSubmission) => {
    const cleanPhone = sub.customerPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('90')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? '9' + cleanPhone
      : '90' + cleanPhone;

    const message = encodeURIComponent(
      `Merhaba ${sub.customerName}, "${sub.siteName}" üzerinden ilettiğiniz ${
        sub.serviceRequested ? `"${sub.serviceRequested}" ` : ''
      }talebiniz için iletişime geçiyorum.`
    );
    return `https://wa.me/${phoneWithCountry}?text=${message}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Gelen Talepler & Randevular ({submissions.length})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Tüm müşteri sitelerinizin ziyaretçilerinden gelen online randevular, siparişler ve fiyat teklifi formları.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Müşteri adı, telefon veya not ara..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Site Filter */}
        <div>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Tüm Müşteri Siteleri ({sites.length})</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'new', label: 'Yeni' },
            { id: 'confirmed', label: 'Onaylandı' },
            { id: 'completed', label: 'Tamamlandı' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedStatus === st.id
                  ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length > 0 ? (
        <div className="space-y-3">
          {filteredSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 sm:p-5 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-sm text-amber-400">
                    {sub.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{sub.customerName}</span>
                      <span className="text-xs text-neutral-500">·</span>
                      <span className="text-xs text-amber-400/90 font-medium">{sub.siteName}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5 font-mono">
                      <span>{sub.customerPhone}</span>
                      {sub.customerEmail && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{sub.customerEmail}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={sub.status}
                    onChange={(e) => onUpdateStatus(sub.id, e.target.value as any)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium border cursor-pointer ${
                      sub.status === 'new'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : sub.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : sub.status === 'completed'
                        ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    <option value="new">Yeni Talep</option>
                    <option value="confirmed">Onaylandı</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>

                  <button
                    onClick={() => {
                      if (confirm('Bu talebi silmek istediğinize emin misiniz?')) {
                        onDeleteSubmission(sub.id);
                      }
                    }}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer rounded"
                    title="Talebi Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Service & Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {sub.serviceRequested && (
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Talep Edilen Hizmet / Menü:</span>
                    <span className="text-white font-medium">{sub.serviceRequested}</span>
                  </div>
                )}

                {(sub.requestedDate || sub.requestedTime) && (
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Randevu / Teslim Zamanı:</span>
                    <span className="text-white font-mono">
                      {sub.requestedDate || ''} {sub.requestedTime ? `(${sub.requestedTime})` : ''}
                    </span>
                  </div>
                )}

                {sub.address && (
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Teslimat Adresi:</span>
                    <span className="text-neutral-300">{sub.address}</span>
                  </div>
                )}
              </div>

              {sub.notes && (
                <div className="p-2.5 bg-neutral-950/70 border border-neutral-800 rounded-lg text-xs text-neutral-300">
                  <span className="text-neutral-500 text-[11px] block mb-0.5">Müşteri Notu:</span>
                  {sub.notes}
                </div>
              )}

              {/* Action Buttons: WhatsApp & Call */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <a
                  href={`tel:${sub.customerPhone}`}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                  Müşteriyi Ara
                </a>

                <a
                  href={getWhatsAppLink(sub)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp ile Yanıtla
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">Gelen Talep Bulunmuyor</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Müşterilerinizin sitelerindeki randevu veya sipariş formları doldurulduğunda talepler anında bu kutuda listelenecektir.
          </p>
        </div>
      )}
    </div>
  );
};
