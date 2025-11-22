const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4100;

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const DB_FILE = path.join(__dirname, 'data', 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(DB_FILE))) fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

// Initialize DB if empty
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
        heroSlides: [],
        initiatives: [],
        programs: [],
        messages: []
    }, null, 2));
}

const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) { return { heroSlides: [], initiatives: [], programs: [], messages: [] }; }
};
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});
const upload = multer({ storage });

// --- Routes ---

app.get('/api/content', (req, res) => res.json(readDB()));

app.post('/api/hero', upload.single('image'), (req, res) => {
    const db = readDB();
    let imageUrl = req.body.src || '';
    if (req.file) {
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const newSlide = {
        id: Date.now(),
        title: req.body.title,
        subtitle: req.body.subtitle,
        href: req.body.href,
        src: imageUrl
    };
    db.heroSlides.push(newSlide);
    writeDB(db);
    res.json(newSlide);
});

app.delete('/api/hero/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    db.heroSlides = db.heroSlides.filter(s => s.id !== id);
    writeDB(db);
    res.json({ success: true });
});

app.post('/api/initiatives', (req, res) => {
    const db = readDB();
    const item = { id: Date.now(), ...req.body };
    db.initiatives.push(item);
    writeDB(db);
    res.json(item);
});

app.delete('/api/initiatives/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    db.initiatives = db.initiatives.filter(i => i.id !== id);
    writeDB(db);
    res.json({ success: true });
});

app.post('/api/programs', (req, res) => {
    const db = readDB();
    const item = { id: Date.now(), ...req.body };
    db.programs.push(item);
    writeDB(db);
    res.json(item);
});

app.delete('/api/programs/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    db.programs = db.programs.filter(p => p.id !== id);
    writeDB(db);
    res.json({ success: true });
});

app.post('/api/messages', (req, res) => {
    const db = readDB();
    const msg = { id: Date.now(), createdAt: new Date(), ...req.body };
    db.messages.push(msg);
    writeDB(db);
    res.json(msg);
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});