import React, { useState } from 'react';
import { STOCK_IMAGES, StockAssetItem } from '../../data/stockAssets';
import { X, Upload, Link, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImageSelectorModalProps {
  title?: string;
  currentImageUrl?: string;
  onSelectImage: (imageUrl: string) => void;
  onClose: () => void;
}

export const ImageSelectorModal: React.FC<ImageSelectorModalProps> = ({
  title = 'Görsel Seç veya Değiştir',
  currentImageUrl,
  onSelectImage,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'upload' | 'url'>('stock');
  const [customUrl, setCustomUrl] = useState('');
  const [selectedStockId, setSelectedStockId] = useState<string>('');
  const [previewUpload, setPreviewUpload] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (activeTab === 'stock') {
      const item = STOCK_IMAGES.find((s) => s.id === selectedStockId);
      if (item) {
        onSelectImage(item.url);
        onClose();
      }
    } else if (activeTab === 'upload' && previewUpload) {
      onSelectImage(previewUpload);
      onClose();
    } else if (activeTab === 'url' && customUrl.trim()) {
      onSelectImage(customUrl.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 block">Şablon & Site Görsel Yönetimi</span>
            <h3 className="text-base font-bold text-white mt-0.5">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-4 border-b border-neutral-800 bg-neutral-950/40">
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'stock'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Hazır Sektör Görselleri ({STOCK_IMAGES.length})
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Bilgisayardan Yükle
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'url'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            Görsel Web URL'si
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'stock' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                Esnaflar ve işletmeler için yüksek çözünürlüklü profesyonel sektör fotoğraflarından birini seçin:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STOCK_IMAGES.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedStockId(img.id)}
                    className={`group relative aspect-[16/10] rounded-xl overflow-hidden border cursor-pointer transition-all ${
                      selectedStockId === img.id || (!selectedStockId && currentImageUrl === img.url)
                        ? 'border-amber-400 ring-2 ring-amber-400/30'
                        : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 right-2 text-[11px] font-medium text-white truncate">
                      {img.title}
                    </span>

                    {(selectedStockId === img.id || (!selectedStockId && currentImageUrl === img.url)) && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4 text-center">
              <div className="border-2 border-dashed border-neutral-700 hover:border-amber-500/50 rounded-2xl p-8 transition-colors">
                <input
                  type="file"
                  id="imageUploadInput"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="imageUploadInput"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-amber-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Fotoğraf Dosyası Seçin veya Buraya Bırakın
                    </span>
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      PNG, JPG, WEBP formatları desteklenir
                    </span>
                  </div>
                </label>
              </div>

              {previewUpload && (
                <div className="space-y-2 text-left">
                  <span className="text-xs font-semibold text-neutral-300">Yüklenen Fotoğraf Önizlemesi:</span>
                  <div className="aspect-[16/9] w-full max-h-48 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                    <img
                      src={previewUpload}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Harici Görsel Bağlantısı (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/gorsel.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {customUrl.trim() && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-neutral-300">Bağlantı Önizlemesi:</span>
                  <div className="aspect-[16/9] w-full max-h-48 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                    <img
                      src={customUrl}
                      alt="URL preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Görseli Seç ve Uygula
          </button>
        </div>
      </div>
    </div>
  );
};
