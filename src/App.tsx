import React, { useState, useEffect } from 'react';
import { ClientSite, LeadSubmission, BusinessTemplate } from './types';
import { ApiService } from './services/api';
import { BUSINESS_TEMPLATES } from './data/templates';
import { Navbar } from './components/admin/Navbar';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { SiteList } from './components/admin/SiteList';
import { TemplateCatalog } from './components/admin/TemplateCatalog';
import { SiteEditor } from './components/admin/SiteEditor';
import { InquiriesInbox } from './components/admin/InquiriesInbox';
import { NewSiteModal } from './components/admin/NewSiteModal';
import { ClientWebsite } from './components/client/ClientWebsite';
import { CheckCircle2, Info, X } from 'lucide-react';

export default function App() {
  const [sites, setSites] = useState<ClientSite[]>([]);
  const [submissions, setSubmissions] = useState<LeadSubmission[]>([]);
  const [templates] = useState<BusinessTemplate[]>(BUSINESS_TEMPLATES);

  // Navigation states
  const [activeTab, setActiveTab] = useState<'overview' | 'sites' | 'templates' | 'inbox'>('overview');
  const [viewMode, setViewMode] = useState<'admin' | 'editor' | 'client_preview'>('admin');
  const [selectedSite, setSelectedSite] = useState<ClientSite | null>(null);

  // Modal states
  const [isNewSiteModalOpen, setIsNewSiteModalOpen] = useState(false);
  const [initialTemplateForModal, setInitialTemplateForModal] = useState<BusinessTemplate | null>(null);
  const [previewTemplateModal, setPreviewTemplateModal] = useState<BusinessTemplate | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Data Load & Hash Routing check
  useEffect(() => {
    async function loadData() {
      try {
        const loadedSites = await ApiService.getSites();
        setSites(loadedSites);

        const loadedSubmissions = await ApiService.getSubmissions();
        setSubmissions(loadedSubmissions);

        // Check hash URL (e.g. #site=has-tas-firini)
        const hash = window.location.hash;
        if (hash.startsWith('#site=')) {
          const slug = hash.replace('#site=', '');
          const matching = loadedSites.find((s) => s.slug === slug);
          if (matching) {
            setSelectedSite(matching);
            setViewMode('client_preview');
          }
        }
      } catch (err) {
        console.error('Data loading error:', err);
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleOpenNewSiteModal = (tpl?: BusinessTemplate) => {
    setInitialTemplateForModal(tpl || null);
    setIsNewSiteModalOpen(true);
  };

  const handleCreateSite = async (newSiteData: Partial<ClientSite>) => {
    try {
      const created = await ApiService.createSite(newSiteData);
      setSites((prev) => [created, ...prev]);
      setIsNewSiteModalOpen(false);
      setSelectedSite(created);
      setViewMode('editor');
      showToast(`"${created.name}" sitesi başarıyla oluşturuldu!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSite = async (updatedSite: ClientSite) => {
    try {
      const saved = await ApiService.updateSite(updatedSite);
      setSites((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
      setSelectedSite(saved);
      showToast(`"${saved.name}" güncellemeleri başarıyla kaydedildi!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSite = async (id: string) => {
    try {
      await ApiService.deleteSite(id);
      setSites((prev) => prev.filter((s) => s.id !== id));
      setSubmissions((prev) => prev.filter((sub) => sub.siteId !== id));
      showToast('Site ve ilişkili veriler silindi.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicateSite = async (site: ClientSite) => {
    try {
      const copy = await ApiService.duplicateSite(site);
      setSites((prev) => [copy, ...prev]);
      showToast(`"${site.name}" kopyalandı ve yeni site oluşturuldu.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (site: ClientSite) => {
    const newStatus = site.status === 'published' ? 'draft' : 'published';
    const updated = { ...site, status: newStatus as any };
    await handleSaveSite(updated);
  };

  // Visitor submissions on customer sites
  const handleSubmitBooking = async (submission: Partial<LeadSubmission>) => {
    try {
      const created = await ApiService.createSubmission(submission);
      setSubmissions((prev) => [created, ...prev]);
      // Update local inquiry count for site
      setSites((prev) =>
        prev.map((s) =>
          s.id === submission.siteId
            ? { ...s, inquiryCount: (s.inquiryCount || 0) + 1 }
            : s
        )
      );
      showToast('Yeni müşteri talebi kaydedildi!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSubmissionStatus = async (
    id: string,
    status: LeadSubmission['status']
  ) => {
    try {
      await ApiService.updateSubmissionStatus(id, status);
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status } : sub))
      );
      showToast('Talep durumu güncellendi.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    try {
      await ApiService.deleteSubmission(id);
      setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
      showToast('Talep silindi.');
    } catch (err) {
      console.error(err);
    }
  };

  // Render Client Preview Mode (Actual standalone website)
  if (viewMode === 'client_preview' && selectedSite) {
    return (
      <ClientWebsite
        site={selectedSite}
        onBackToAdmin={() => {
          setViewMode('admin');
          window.location.hash = '';
        }}
        onEditSite={(s) => {
          setSelectedSite(s);
          setViewMode('editor');
          window.location.hash = '';
        }}
        onSubmitBooking={handleSubmitBooking}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-amber-500/40 text-neutral-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-neutral-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setViewMode('admin');
        }}
        onNewSiteClick={() => handleOpenNewSiteModal()}
        totalInquiries={submissions.filter((s) => s.status === 'new').length}
      />

      {/* Main Admin Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'editor' && selectedSite ? (
          <SiteEditor
            site={selectedSite}
            onSave={handleSaveSite}
            onBack={() => {
              setViewMode('admin');
              setActiveTab('sites');
            }}
            onPreview={(siteToPreview) => {
              setSelectedSite(siteToPreview);
              setViewMode('client_preview');
            }}
          />
        ) : (
          <>
            {activeTab === 'overview' && (
              <DashboardOverview
                sites={sites}
                submissions={submissions}
                templates={templates}
                onSelectSite={(site) => {
                  setSelectedSite(site);
                  setViewMode('editor');
                }}
                onPreviewSite={(site) => {
                  setSelectedSite(site);
                  setViewMode('client_preview');
                }}
                onNewSite={() => handleOpenNewSiteModal()}
                onUseTemplate={(tpl) => handleOpenNewSiteModal(tpl)}
                onGoToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'sites' && (
              <SiteList
                sites={sites}
                onSelectSite={(site) => {
                  setSelectedSite(site);
                  setViewMode('editor');
                }}
                onPreviewSite={(site) => {
                  setSelectedSite(site);
                  setViewMode('client_preview');
                }}
                onDuplicateSite={handleDuplicateSite}
                onDeleteSite={handleDeleteSite}
                onToggleStatus={handleToggleStatus}
                onNewSite={() => handleOpenNewSiteModal()}
              />
            )}

            {activeTab === 'templates' && (
              <TemplateCatalog
                templates={templates}
                onUseTemplate={(tpl) => handleOpenNewSiteModal(tpl)}
                onPreviewTemplate={(tpl) => setPreviewTemplateModal(tpl)}
              />
            )}

            {activeTab === 'inbox' && (
              <InquiriesInbox
                submissions={submissions}
                sites={sites}
                onUpdateStatus={handleUpdateSubmissionStatus}
                onDeleteSubmission={handleDeleteSubmission}
              />
            )}
          </>
        )}
      </main>

      {/* New Site Wizard Modal */}
      {isNewSiteModalOpen && (
        <NewSiteModal
          templates={templates}
          initialTemplate={initialTemplateForModal}
          onClose={() => setIsNewSiteModalOpen(false)}
          onCreateSite={handleCreateSite}
        />
      )}

      {/* Template Details Preview Modal */}
      {previewTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="relative aspect-[16/9] w-full bg-neutral-800">
              <img
                src={previewTemplateModal.previewImage}
                alt={previewTemplateModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setPreviewTemplateModal(null)}
                className="absolute top-3 right-3 p-1.5 bg-neutral-950/80 rounded-lg text-white hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <span className="text-xs text-amber-400 font-semibold block">
                  {previewTemplateModal.categoryLabel}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {previewTemplateModal.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {previewTemplateModal.description}
                </p>
              </div>

              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <span className="text-xs font-semibold text-white block">
                  Şablon İle Birlikte Gelen Hazır İçerikler:
                </span>
                <ul className="text-xs text-neutral-300 space-y-1.5 list-disc list-inside">
                  <li>Sektöre özel fiyat tarifesi ve hizmet/ürün listesi</li>
                  <li>Online randevu veya toplu sipariş alma formu</li>
                  <li>WhatsApp hızlı iletişim hattı & Google Harita konumu</li>
                  <li>Hazır müşteri yorumları & esnaf hikayesi</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setPreviewTemplateModal(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white cursor-pointer"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  const tpl = previewTemplateModal;
                  setPreviewTemplateModal(null);
                  handleOpenNewSiteModal(tpl);
                }}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Bu Şablonla Müşteri Sitesi Aç
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
