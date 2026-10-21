import { ClientSite, LeadSubmission } from '../types';
import { INITIAL_SITES, INITIAL_SUBMISSIONS } from '../data/initialData';
import { DEFAULT_LAYOUT } from '../data/stockAssets';

const SITES_STORAGE_KEY = 'esnaf_panel_sites_v2';
const SUBMISSIONS_STORAGE_KEY = 'esnaf_panel_submissions_v1';

function normalizeSite(site: any): ClientSite {
  return {
    ...site,
    layout: {
      ...DEFAULT_LAYOUT,
      ...(site.layout || {}),
      sectionsVisibility: {
        ...DEFAULT_LAYOUT.sectionsVisibility,
        ...(site.layout?.sectionsVisibility || {}),
      },
      sectionsOrder: site.layout?.sectionsOrder || DEFAULT_LAYOUT.sectionsOrder,
    },
  };
}

function getLocalSites(): ClientSite[] {
  try {
    const raw = localStorage.getItem(SITES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeSite);
      }
    }
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }
  return INITIAL_SITES.map(normalizeSite);
}

function saveLocalSites(sites: ClientSite[]) {
  try {
    localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

function getLocalSubmissions(): LeadSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }
  return INITIAL_SUBMISSIONS;
}

function saveLocalSubmissions(subs: LeadSubmission[]) {
  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(subs));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

export const ApiService = {
  async getSites(): Promise<ClientSite[]> {
    try {
      const res = await fetch('/api/sites');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map(normalizeSite);
          saveLocalSites(normalized);
          return normalized;
        } else {
          // If server is empty, initialize server with initial sites
          const initial = getLocalSites();
          await fetch('/api/sites/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sites: initial }),
          });
          return initial;
        }
      }
    } catch {
      // Offline or direct Vite fallback
    }
    return getLocalSites();
  },

  async createSite(newSiteData: Partial<ClientSite>): Promise<ClientSite> {
    const site: ClientSite = {
      ...(newSiteData as ClientSite),
      id: newSiteData.id || 'site_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 0,
      inquiryCount: 0,
    };

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocalSites();
        saveLocalSites([created, ...current]);
        return created;
      }
    } catch {
      // Fallback
    }

    const current = getLocalSites();
    const updated = [site, ...current];
    saveLocalSites(updated);
    return site;
  },

  async updateSite(site: ClientSite): Promise<ClientSite> {
    const updatedWithTimestamp = {
      ...site,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`/api/sites/${site.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWithTimestamp),
      });
      if (res.ok) {
        const result = await res.json();
        const current = getLocalSites();
        const idx = current.findIndex((s) => s.id === site.id);
        if (idx !== -1) {
          current[idx] = result;
          saveLocalSites([...current]);
        }
        return result;
      }
    } catch {
      // Fallback
    }

    const current = getLocalSites();
    const idx = current.findIndex((s) => s.id === site.id);
    if (idx !== -1) {
      current[idx] = updatedWithTimestamp;
      saveLocalSites([...current]);
    }
    return updatedWithTimestamp;
  },

  async deleteSite(id: string): Promise<void> {
    try {
      await fetch(`/api/sites/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }
    const current = getLocalSites();
    saveLocalSites(current.filter((s) => s.id !== id));

    const subs = getLocalSubmissions();
    saveLocalSubmissions(subs.filter((s) => s.siteId !== id));
  },

  async duplicateSite(site: ClientSite): Promise<ClientSite> {
    const duplicated: ClientSite = {
      ...site,
      id: 'site_' + Date.now(),
      name: `${site.name} (Kopya)`,
      slug: `${site.slug}-kopya-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 0,
      inquiryCount: 0,
    };
    return this.createSite(duplicated);
  },

  async getSubmissions(siteId?: string): Promise<LeadSubmission[]> {
    try {
      const url = siteId ? `/api/submissions?siteId=${siteId}` : '/api/submissions';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          if (!siteId) saveLocalSubmissions(data);
          return data;
        }
      }
    } catch {
      // Fallback
    }
    const all = getLocalSubmissions();
    if (siteId) {
      return all.filter((s) => s.siteId === siteId);
    }
    return all;
  },

  async createSubmission(data: Partial<LeadSubmission>): Promise<LeadSubmission> {
    const sub: LeadSubmission = {
      id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      siteId: data.siteId || 'unknown',
      siteName: data.siteName || 'Müşteri Sitesi',
      category: data.category || 'custom',
      type: data.type || 'appointment',
      customerName: data.customerName || 'Ziyaretçi',
      customerPhone: data.customerPhone || '',
      customerEmail: data.customerEmail,
      serviceRequested: data.serviceRequested,
      requestedDate: data.requestedDate,
      requestedTime: data.requestedTime,
      notes: data.notes,
      address: data.address,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocalSubmissions();
        saveLocalSubmissions([created, ...current]);
        return created;
      }
    } catch {
      // Fallback
    }

    const current = getLocalSubmissions();
    saveLocalSubmissions([sub, ...current]);
    return sub;
  },

  async updateSubmissionStatus(id: string, status: LeadSubmission['status']): Promise<void> {
    try {
      await fetch(`/api/submissions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Fallback
    }
    const current = getLocalSubmissions();
    const idx = current.findIndex((s) => s.id === id);
    if (idx !== -1) {
      current[idx].status = status;
      saveLocalSubmissions([...current]);
    }
  },

  async deleteSubmission(id: string): Promise<void> {
    try {
      await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }
    const current = getLocalSubmissions();
    saveLocalSubmissions(current.filter((s) => s.id !== id));
  },

  async recordPageView(siteId: string): Promise<void> {
    try {
      await fetch(`/api/sites/${siteId}/view`, { method: 'POST' });
    } catch {
      // Fallback
    }
    const sites = getLocalSites();
    const s = sites.find((x) => x.id === siteId);
    if (s) {
      s.viewsCount = (s.viewsCount || 0) + 1;
      saveLocalSites([...sites]);
    }
  },
};
