import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Database file persistence path
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StoredData {
  sites: any[];
  submissions: any[];
}

function loadDatabase(): StoredData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  return { sites: [], submissions: [] };
}

function saveDatabase(data: StoredData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get all sites
app.get('/api/sites', (req, res) => {
  const db = loadDatabase();
  res.json(db.sites || []);
});

// Save all sites (bulk update or initial sync)
app.post('/api/sites/sync', (req, res) => {
  const db = loadDatabase();
  if (Array.isArray(req.body.sites)) {
    db.sites = req.body.sites;
    saveDatabase(db);
  }
  res.json({ success: true, count: db.sites.length });
});

// Create site
app.post('/api/sites', (req, res) => {
  const db = loadDatabase();
  const newSite = req.body;
  if (!newSite.id) {
    newSite.id = 'site_' + Date.now();
  }
  newSite.createdAt = newSite.createdAt || new Date().toISOString();
  newSite.updatedAt = new Date().toISOString();
  db.sites.unshift(newSite);
  saveDatabase(db);
  res.status(201).json(newSite);
});

// Update site
app.put('/api/sites/:id', (req, res) => {
  const db = loadDatabase();
  const id = req.params.id;
  const index = db.sites.findIndex((s: any) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Site not found' });
  }
  const updatedSite = { ...db.sites[index], ...req.body, updatedAt: new Date().toISOString() };
  db.sites[index] = updatedSite;
  saveDatabase(db);
  res.json(updatedSite);
});

// Delete site
app.delete('/api/sites/:id', (req, res) => {
  const db = loadDatabase();
  const id = req.params.id;
  db.sites = db.sites.filter((s: any) => s.id !== id);
  db.submissions = db.submissions.filter((sub: any) => sub.siteId !== id);
  saveDatabase(db);
  res.json({ success: true, id });
});

// Get all lead submissions (CRM inbox)
app.get('/api/submissions', (req, res) => {
  const db = loadDatabase();
  const siteId = req.query.siteId as string | undefined;
  if (siteId) {
    return res.json(db.submissions.filter((s: any) => s.siteId === siteId));
  }
  res.json(db.submissions || []);
});

// Post a new appointment / inquiry from a customer site
app.post('/api/submissions', (req, res) => {
  const db = loadDatabase();
  const newSub = req.body;
  if (!newSub.id) {
    newSub.id = 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  }
  newSub.createdAt = newSub.createdAt || new Date().toISOString();
  newSub.status = newSub.status || 'new';
  db.submissions.unshift(newSub);

  // Increment inquiry count on corresponding site
  const siteIndex = db.sites.findIndex((s: any) => s.id === newSub.siteId);
  if (siteIndex !== -1) {
    db.sites[siteIndex].inquiryCount = (db.sites[siteIndex].inquiryCount || 0) + 1;
  }

  saveDatabase(db);
  res.status(201).json(newSub);
});

// Update submission status
app.patch('/api/submissions/:id/status', (req, res) => {
  const db = loadDatabase();
  const id = req.params.id;
  const { status } = req.body;
  const index = db.submissions.findIndex((s: any) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  db.submissions[index].status = status;
  saveDatabase(db);
  res.json(db.submissions[index]);
});

// Delete submission
app.delete('/api/submissions/:id', (req, res) => {
  const db = loadDatabase();
  const id = req.params.id;
  db.submissions = db.submissions.filter((s: any) => s.id !== id);
  saveDatabase(db);
  res.json({ success: true, id });
});

// Increment page views
app.post('/api/sites/:id/view', (req, res) => {
  const db = loadDatabase();
  const id = req.params.id;
  const site = db.sites.find((s: any) => s.id === id);
  if (site) {
    site.viewsCount = (site.viewsCount || 0) + 1;
    saveDatabase(db);
  }
  res.json({ success: true });
});

// Start Express and Vite
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
