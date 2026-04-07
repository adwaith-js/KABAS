import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { TeamStore } from './storage/TeamStore.js';
import { createTeamsRouter } from './routes/teams.js';
import { createAnalysisRouter } from './routes/analysis.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const store = new TeamStore(path.resolve(__dirname, '../data'));

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api', createTeamsRouter(store));
app.use('/api', createAnalysisRouter(store));

app.get('/api/health', (_, res) => res.json({ status: 'ok', version: '1.0.0' }));

app.listen(PORT, () => console.log(`KABAS server running on http://localhost:${PORT}`));
