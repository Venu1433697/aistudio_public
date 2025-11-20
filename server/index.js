const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads/gallery');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- In-Memory Database ---
// NOTE: Data resets when server restarts

// 1. Admin: Credentials exist, but profile details are EMPTY
let ADMIN = {
    id: '1',
    firstName: '', // Blank as requested
    lastName: '',
    email: 'admin1@example.com',
    mobile: '',
    gender: ''
};

// 2. Users: Empty list (No 50 generated users)
let USERS = [];

// 3. Gallery: Empty
let GALLERY = [];

// Auth Middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        next();
    } else {
        res.sendStatus(401);
    }
};

// File Storage Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

// --- Routes ---

// 1. Auth
app.post('/api/admin-auth', (req, res) => {
    const { email, password } = req.body;
    
    // Verify Credentials
    if (email === 'admin1@example.com' && password === 'Admin@123') {
        res.json({
            token: 'jwt-token-' + Date.now(),
            admin: ADMIN,
            users: USERS
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// 2. Users
app.get('/api/users', authenticate, (req, res) => {
    res.json(USERS);
});

app.post('/api/users', authenticate, (req, res) => {
    const newUser = { ...req.body, _id: `user-${Date.now()}` };
    USERS.unshift(newUser);
    res.status(201).json(newUser);
});

app.put('/api/users/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const index = USERS.findIndex(u => u._id === id);
    if (index > -1) {
        USERS[index] = { ...USERS[index], ...req.body };
        res.json(USERS[index]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.delete('/api/users/:id', authenticate, (req, res) => {
    USERS = USERS.filter(u => u._id !== req.params.id);
    res.json({ message: 'Deleted' });
});

// 3. Admin Profile
app.get('/api/admin-profile', authenticate, (req, res) => {
    res.json(ADMIN);
});

app.put('/api/admin-profile', authenticate, (req, res) => {
    // Update admin fields
    ADMIN = { ...ADMIN, ...req.body };
    res.json(ADMIN);
});

// 4. Business Gallery
app.get('/api/business-gallery', authenticate, (req, res) => {
    res.json(GALLERY);
});

app.post('/api/business-gallery', authenticate, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    const newItem = {
        _id: Date.now().toString(),
        title: req.body.title || 'New Image',
        description: req.body.description || '',
        url: `/uploads/gallery/${req.file.filename}`,
        createdAt: new Date()
    };
    GALLERY.unshift(newItem);
    res.status(201).json(newItem);
});

// Start Server
app.listen(PORT, () => {
    console.log(`OneShop Server running on http://localhost:${PORT}`);
});