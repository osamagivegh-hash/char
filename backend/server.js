const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 4100;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

const base64Url = (input) => Buffer.from(input).toString('base64url');
const signJwt = (payload, expiresInSeconds = 7200) => {
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body = base64Url(JSON.stringify({ ...payload, exp }));
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
};

const verifyJwt = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  const [header, body, signature] = parts;
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error('Invalid signature');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Expired');
  return payload;
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, stored) => {
  if (!stored) return false;
  const [salt, hashed] = stored.split(':');
  if (!salt || !hashed) return false;
  const attempt = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hashed, 'hex'), Buffer.from(attempt, 'hex'));
};

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

const CONTENT_FILE = path.join(__dirname, 'data', 'siteContent.json');

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(CONTENT_FILE))) fs.mkdirSync(path.dirname(CONTENT_FILE), { recursive: true });

const defaultContent = () => ({
  heroSlides: [],
  heroImage: '',
  initiatives: [],
  programs: [],
  messages: [],
  about: { title: '', description: '' },
  contact: { phone: '', email: '', address: '' },
  vision: { title: '', description: '' },
  mission: { title: '', description: '' },
  donate: { title: '', description: '', bank: '', link: '' },
  volunteer: { title: '', description: '', steps: [] },
  admin: { username: 'admin', passwordHash: '' },
});

const ensureDefaults = (data) => {
  const base = defaultContent();
  const merged = { ...base, ...data };
  merged.about = { ...base.about, ...(data.about || {}) };
  merged.contact = { ...base.contact, ...(data.contact || {}) };
  merged.vision = { ...base.vision, ...(data.vision || {}) };
  merged.mission = { ...base.mission, ...(data.mission || {}) };
  merged.donate = { ...base.donate, ...(data.donate || {}) };
  merged.volunteer = { ...base.volunteer, ...(data.volunteer || {}) };
  merged.heroSlides = Array.isArray(data.heroSlides) ? data.heroSlides : [];
  merged.heroImage = data.heroImage || '';
  merged.initiatives = Array.isArray(data.initiatives) ? data.initiatives : [];
  merged.programs = Array.isArray(data.programs) ? data.programs : [];
  merged.messages = Array.isArray(data.messages) ? data.messages : [];
  merged.admin = data.admin || base.admin;
  if (!merged.admin.passwordHash) {
    merged.admin.passwordHash = hashPassword(DEFAULT_ADMIN_PASSWORD);
  }
  if (!merged.admin.username) merged.admin.username = 'admin';
  return merged;
};

const readContent = () => {
  if (!fs.existsSync(CONTENT_FILE)) {
    const seeded = ensureDefaults(defaultContent());
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(seeded, null, 2));
    return seeded;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
    const withDefaults = ensureDefaults(raw);
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(withDefaults, null, 2));
    return withDefaults;
  } catch (e) {
    const seeded = ensureDefaults(defaultContent());
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(seeded, null, 2));
    return seeded;
  }
};

const writeContent = (data) => fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2));

const sanitizeContent = (data) => {
  const { admin, ...rest } = data;
  return rest;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});
const upload = multer({ storage });

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token' });
  try {
    const payload = verifyJwt(token);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// --- Public routes ---
app.get('/api/content', (req, res) => {
  const data = readContent();
  res.json(sanitizeContent(data));
});

app.post('/api/messages', (req, res) => {
  const data = readContent();
  const msg = { id: Date.now(), createdAt: new Date().toISOString(), ...req.body };
  data.messages.push(msg);
  writeContent(data);
  res.json(msg);
});

// --- Auth routes ---
app.post('/api/dashboard/auth/login', (req, res) => {
  const { username, password } = req.body;
  const data = readContent();
  const admin = data.admin;
  if (!admin || admin.username !== username) {
    return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
  }
  const match = verifyPassword(password, admin.passwordHash || '');
  if (!match) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
  const token = signJwt({ username: admin.username });
  res.json({ token, user: { username: admin.username } });
});

app.get('/api/dashboard/auth/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// --- Helper for single object sections ---
const createSingleSectionRoutes = (section) => {
  app.get(`/api/dashboard/${section}`, verifyToken, (req, res) => {
    const data = readContent();
    res.json(data[section]);
  });

  app.post(`/api/dashboard/${section}`, verifyToken, (req, res) => {
    const data = readContent();
    data[section] = req.body;
    writeContent(data);
    res.json(data[section]);
  });

  app.put(`/api/dashboard/${section}`, verifyToken, (req, res) => {
    const data = readContent();
    data[section] = { ...(data[section] || {}), ...req.body };
    writeContent(data);
    res.json(data[section]);
  });

  app.delete(`/api/dashboard/${section}`, verifyToken, (req, res) => {
    const data = readContent();
    data[section] = defaultContent()[section];
    writeContent(data);
    res.json({ success: true });
  });
};

['about', 'contact', 'vision', 'mission', 'donate', 'volunteer'].forEach(createSingleSectionRoutes);

// --- Hero routes ---
app.get('/api/dashboard/hero', verifyToken, (req, res) => {
  const data = readContent();
  res.json({ heroSlides: data.heroSlides, heroImage: data.heroImage });
});

app.post('/api/dashboard/hero', verifyToken, upload.single('image'), (req, res) => {
  const data = readContent();
  let imageUrl = req.body.src || '';
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  const newSlide = {
    id: Date.now(),
    title: req.body.title,
    subtitle: req.body.subtitle,
    href: req.body.href,
    src: imageUrl,
  };
  data.heroSlides.push(newSlide);
  writeContent(data);
  res.json(newSlide);
});

app.put('/api/dashboard/hero/:id', verifyToken, upload.single('image'), (req, res) => {
  const data = readContent();
  const id = parseInt(req.params.id, 10);
  const slideIndex = data.heroSlides.findIndex((s) => s.id === id);
  if (slideIndex === -1) return res.status(404).json({ message: 'Slide not found' });
  let imageUrl = data.heroSlides[slideIndex].src;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  } else if (req.body.src) {
    imageUrl = req.body.src;
  }
  data.heroSlides[slideIndex] = {
    ...data.heroSlides[slideIndex],
    title: req.body.title ?? data.heroSlides[slideIndex].title,
    subtitle: req.body.subtitle ?? data.heroSlides[slideIndex].subtitle,
    href: req.body.href ?? data.heroSlides[slideIndex].href,
    src: imageUrl,
  };
  writeContent(data);
  res.json(data.heroSlides[slideIndex]);
});

app.delete('/api/dashboard/hero/:id', verifyToken, (req, res) => {
  const data = readContent();
  const id = parseInt(req.params.id, 10);
  data.heroSlides = data.heroSlides.filter((s) => s.id !== id);
  writeContent(data);
  res.json({ success: true });
});

app.put('/api/dashboard/hero-image', verifyToken, upload.single('image'), (req, res) => {
  const data = readContent();
  let imageUrl = data.heroImage;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  } else if (req.body.heroImage) {
    imageUrl = req.body.heroImage;
  }
  data.heroImage = imageUrl;
  writeContent(data);
  res.json({ heroImage: data.heroImage });
});

app.delete('/api/dashboard/hero-image', verifyToken, (req, res) => {
  const data = readContent();
  data.heroImage = '';
  writeContent(data);
  res.json({ success: true });
});

// --- Initiatives routes ---
app.get('/api/dashboard/initiatives', verifyToken, (req, res) => {
  const data = readContent();
  res.json(data.initiatives);
});

app.post('/api/dashboard/initiatives', verifyToken, (req, res) => {
  const data = readContent();
  const item = { id: Date.now(), ...req.body };
  data.initiatives.push(item);
  writeContent(data);
  res.json(item);
});

app.put('/api/dashboard/initiatives/:id', verifyToken, (req, res) => {
  const data = readContent();
  const id = parseInt(req.params.id, 10);
  const idx = data.initiatives.findIndex((i) => i.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  data.initiatives[idx] = { ...data.initiatives[idx], ...req.body };
  writeContent(data);
  res.json(data.initiatives[idx]);
});

app.delete('/api/dashboard/initiatives/:id', verifyToken, (req, res) => {
  const data = readContent();
  const id = parseInt(req.params.id, 10);
  data.initiatives = data.initiatives.filter((i) => i.id !== id);
  writeContent(data);
  res.json({ success: true });
});

// --- Programs routes ---
app.get('/api/dashboard/programs', verifyToken, (req, res) => {
  const data = readContent();
  res.json(data.programs);
});

app.post('/api/dashboard/programs', verifyToken, (req, res) => {
  const data = readContent();
  const item = { id: Date.now(), ...req.body };
  data.programs.push(item);
  writeContent(data);
  res.json(item);
});

app.put('/api/dashboard/programs/:id', verifyToken, (req, res) => {
  const data = readContent();
  const id = parseInt(req.params.id, 10);
  const idx = data.programs.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  data.programs[idx] = { ...data.programs[idx], ...req.body };
  writeContent(data);
  res.json(data.programs[idx]);
});

app.delete('/api/dashboard/programs/:id', verifyToken, (req, res) => {
  const data = readContent();
  const id = parseInt(req.params.id, 10);
  data.programs = data.programs.filter((p) => p.id !== id);
  writeContent(data);
  res.json({ success: true });
});

// --- Messages (dashboard view) ---
app.get('/api/dashboard/messages', verifyToken, (req, res) => {
  const data = readContent();
  res.json(data.messages);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
