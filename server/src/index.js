const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/adminProfile');
const galleryRoutes = require('./routes/gallery');
const visitorRoutes = require('./routes/visitors');

const app = express();
app.use(cors());
const morgan = require('morgan');
const frontendLogger = require('./middleware/frontendLogger');

// morgan for real-time HTTP request logs including timestamp and response time
morgan.token('time', () => new Date().toISOString());
app.use(morgan(':time :method :url :status :response-time ms - :res[content-length]'));
// frontend-style INFO logs used by the admin frontend for request tracing
app.use(frontendLogger);
app.use(express.json());

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/admin-auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin-profile', adminRoutes);
app.use('/api/business-gallery', galleryRoutes);
app.use('/api/visitors', visitorRoutes);
// (health endpoint removed)

app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // no periodic health checks configured
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });
