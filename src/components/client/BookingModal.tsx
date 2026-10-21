import React, { useState } from 'react';
import { ClientSite, LeadSubmission } from '../../types';
import { X, CheckCircle, Calendar, Clock, Phone, User, MessageSquare, MapPin } from 'lucide-react';

interface BookingModalProps {
  site: ClientSite;
  preSelectedService?: string;
  onClose: () => void;
  onSubmit: (submission: Partial<LeadSubmission>) => Promise<void>;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  site,
  preSelectedService = '',
  onClose,
  onSubmit,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceRequested, setServiceRequested] = useState(
    preSelectedService || site.services[0]?.name || site.products[0]?.name || ''
  );
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const booking = site.bookingSettings;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        siteId: site.id,
        siteName: site.name,
        category: site.category,
        type: booking.type,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        serviceRequested: serviceRequested || undefined,
        requestedDate: requestedDate || undefined,
        requestedTime: requestedTime || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 block">
              {site.name}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {booking.title}
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
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Talebiniz Başarıyla Alındı!</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-300 max-w-sm mx-auto">
                  {booking.confirmationText ||
                    'Talebiniz işletmemize iletildi. En kısa sürede telefon ile onay için sizinle iletişime geçeceğiz.'}
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-neutral-400">
                {booking.subtitle}
              </p>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Adınız ve Soyadınız *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ad Soyad"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Telefon Numaranız *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    placeholder="0532 123 45 67"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Hizmet veya Ürün Seçimi */}
              {(site.services.length > 0 || site.products.length > 0) && (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    İstediğiniz Hizmet / Menü Seçimi
                  </label>
                  <select
                    value={serviceRequested}
                    onChange={(e) => setServiceRequested(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Lütfen seçin...</option>
                    {site.services.map((s) => (
                      <option key={s.id} value={`${s.name} (${s.price})`}>
                        {s.name} - {s.price}
                      </option>
                    ))}
                    {site.products.map((p) => (
                      <option key={p.id} value={`${p.name} (${p.price})`}>
                        {p.name} - {p.price}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Randevu Tarihi ve Saati */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Tercih Edilen Gün
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="date"
                      value={requestedDate}
                      onChange={(e) => setRequestedDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Saat
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="time"
                      value={requestedTime}
                      onChange={(e) => setRequestedTime(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Adres (Fırın siparişi veya tesisat usta keşfi için) */}
              {(booking.type === 'order' || booking.type === 'quote') && (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Teslimat veya Keşif Adresi
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Mahalle, cadde, kapı no..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Özel Notunuz / İstekleriniz
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <textarea
                    rows={2}
                    placeholder="Eklemek istediğiniz özel bir talep var mı?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !customerName.trim() || !customerPhone.trim()}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow"
                >
                  {isSubmitting ? 'İletiliyor...' : booking.buttonLabel || 'Talebi İlet'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
