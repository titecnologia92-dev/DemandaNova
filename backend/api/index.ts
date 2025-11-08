// Handler para Vercel serverless
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from '../src/routes';

dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Tratamento explícito de OPTIONS (preflight) antes do CORS middleware
// Isso garante que requisições preflight sejam tratadas corretamente
app.options('*', (req: Request, res: Response) => {
  const origin = req.headers.origin;
  
  if (origin) {
    const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    const isVercel = origin.includes('.vercel.app');
    const isFrontendUrl = FRONTEND_URL && origin.startsWith(FRONTEND_URL);
    
    if (isLocalhost || isVercel || isFrontendUrl || process.env.NODE_ENV === 'development') {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400');
      return res.status(200).end();
    }
  }
  
  res.status(204).end();
});

// Middleware CORS - Configuração mais permissiva para Vercel
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (ex: Postman, mobile apps)
    if (!origin) {
      return callback(null, true);
    }
    
    // Em desenvolvimento, permitir qualquer origin
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Em produção, permitir:
    // 1. URL do frontend configurada em FRONTEND_URL
    // 2. Qualquer URL do Vercel (produção e preview)
    // 3. localhost para testes locais
    const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    const isVercel = origin.includes('.vercel.app');
    const isFrontendUrl = FRONTEND_URL && origin.startsWith(FRONTEND_URL);
    
    if (isLocalhost || isVercel || isFrontendUrl) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400, // 24 horas
  preflightContinue: false,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Se for erro de CORS, retornar resposta apropriada
  if (err.message === 'Not allowed by CORS') {
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    return res.status(403).json({
      error: 'CORS policy violation',
      message: 'Origin not allowed'
    });
  }
  
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Exportar para Vercel serverless
export default app;
