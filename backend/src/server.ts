import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Test Supabase connection
app.get('/test-supabase', async (req: Request, res: Response) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    
    // Teste 1: Verificar se a URL está acessível
    try {
      console.log('Testando conexão HTTP com:', supabaseUrl);
      const httpTest = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`
        }
      });
      console.log('Status HTTP:', httpTest.status);
    } catch (httpError: any) {
      console.error('Erro ao testar HTTP:', httpError.message);
      return res.status(500).json({
        status: 'error',
        message: 'Erro de conexão HTTP com Supabase',
        error: httpError.message,
        url: supabaseUrl
      });
    }
    
    // Teste 2: Usar cliente Supabase
    const { supabase } = await import('./lib/supabase');
    const { data, error } = await supabase.from('produtos').select('*').limit(1);
    
    if (error) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Erro ao buscar dados do Supabase',
        error: error.message,
        details: error
      });
    }
    
    res.json({ 
      status: 'ok', 
      message: 'Conexão com Supabase OK',
      produtosCount: data?.length || 0,
      sample: data?.[0] || null
    });
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao testar Supabase',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

