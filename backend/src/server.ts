import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware CORS - Configuração mais permissiva para Vercel
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (ex: Postman, mobile apps)
    if (!origin) {
      console.log('CORS: Request without origin, allowing');
      return callback(null, true);
    }
    
    console.log(`CORS: Checking origin: ${origin}`);
    console.log(`CORS: FRONTEND_URL: ${FRONTEND_URL}`);
    console.log(`CORS: NODE_ENV: ${process.env.NODE_ENV}`);
    
    // Em desenvolvimento, permitir qualquer origin
    if (process.env.NODE_ENV === 'development') {
      console.log('CORS: Development mode, allowing all origins');
      return callback(null, true);
    }
    
    // Em produção, permitir:
    // 1. URL do frontend configurada em FRONTEND_URL
    // 2. Qualquer URL do Vercel (produção e preview)
    // 3. localhost para testes locais
    const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    const isVercel = origin.includes('.vercel.app');
    const isFrontendUrl = FRONTEND_URL && origin.startsWith(FRONTEND_URL);
    
    console.log(`CORS: isLocalhost: ${isLocalhost}, isVercel: ${isVercel}, isFrontendUrl: ${isFrontendUrl}`);
    
    if (isLocalhost || isVercel || isFrontendUrl) {
      console.log('CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('CORS: Origin NOT allowed');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400 // 24 horas
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

// Para desenvolvimento local
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Exportar para Vercel serverless
export default app;

