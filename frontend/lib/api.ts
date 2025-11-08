import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiError {
  error: string;
  details?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      // Se houver erro de refresh token, limpar sessão
      if (error) {
        if (error.message.includes('refresh_token') || error.message.includes('Invalid Refresh Token')) {
          await supabase.auth.signOut();
          // Redirecionar para login se estiver no cliente
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return null;
      }
      
      return session?.access_token || null;
    } catch (error) {
      // Em caso de erro, limpar sessão
      await supabase.auth.signOut();
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Importante para CORS com credentials
      mode: 'cors', // Garantir modo CORS
    };

    try {
      const response = await fetch(url, config);
      
      // Verificar se a resposta é JSON antes de fazer parse
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Se não for JSON, tentar ler como texto
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(text || 'Erro na requisição');
        }
      }

      if (!response.ok) {
        // Se for erro 401 (não autorizado), limpar sessão e redirecionar
        if (response.status === 401) {
          await supabase.auth.signOut();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro desconhecido');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_URL);
