import express, { Express } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://markdown-editor.jiordiviera.me']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Error handling middleware
app.use(errorHandler);

// Export for Vercel
export default app;
