import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { TeamStore } from './storage/TeamStore.js';
import { createTeamsRouter } from './routes/teams.js';
import { createAnalysisRouter } from './routes/analysis.js';
import { createAuthRouter } from './routes/auth.js';
import { requireAuth } from './middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const store = new TeamStore(path.resolve(__dirname, '../data'));

// Security headers
app.use(helmet());

// CORS — allow configured origin(s) plus localhost for dev
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://kabas-test.vercel.app',
].filter(Boolean) as string[];
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

// Rate limiting — 100 requests per 15 minutes globally
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

// Stricter rate limit on login — 20 attempts per 15 minutes
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again later.' },
}));

// Public routes
app.use('/api', createAuthRouter());
app.get('/api/health', (_, res) => res.json({ status: 'ok', version: '1.0.0' }));

// Protected routes — require valid JWT
app.use('/api', requireAuth, createTeamsRouter(store));
app.use('/api', requireAuth, createAnalysisRouter(store));

app.listen(PORT, () => console.log(`KABAS server running on http://localhost:${PORT}`));
