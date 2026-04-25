const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────
const allowedOrigins = [
  'https://smart-task-manager-one-brown.vercel.app',
  'https://smart-task-manager-one-brown.vercel.app/',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes(`${origin}/`)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ──────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// ─── Health Check ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Smart Task Manager API is live! 🚀',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      analytics: '/api/analytics',
    },
  });
});

// ─── Global Error Handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ─── Start Server ────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🌍 Client: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
});