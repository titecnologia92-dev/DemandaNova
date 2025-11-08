'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Verifica os parâmetros da URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('registered') === 'true') {
        if (params.get('confirm_email') === 'true') {
          setSuccess('Conta criada! Verifique seu email para confirmar a conta antes de fazer login.');
        } else {
          setSuccess('Conta criada com sucesso! Faça login para continuar.');
        }
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex flex-col">
      <div className="mb-8 md:mb-12 text-center">
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
          <img
            className="w-full h-full object-contain"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/cbf07aa665-098c49220489ac816007.png"
            alt="minimal cupcake logo icon in grayscale"
          />
        </div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Sweet Delights</h1>
      </div>

      <div className="w-full max-w-md md:max-w-lg mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <Link
            href="#"
            className="block text-center text-sm text-gray-600 hover:text-gray-800"
          >
            Esqueci minha senha
          </Link>
        </form>

        <div className="text-center">
          <Link
            href="/registro"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Não tem uma conta? <span className="font-medium">Criar conta</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

