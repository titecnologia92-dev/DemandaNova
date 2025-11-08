'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function RegistroPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validações
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (nome.length < 2) {
      setError('O nome deve ter no mínimo 2 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        console.error('Erro do Supabase:', error);
        console.error('Código do erro:', error.status);
        console.error('Mensagem:', error.message);
        throw error;
      }

      if (data.user) {
        // Verifica se precisa confirmar email
        if (data.session) {
          // Email confirmado automaticamente, já pode fazer login
          router.push('/');
          router.refresh();
        } else {
          // Precisa confirmar email
          router.push('/login?registered=true&confirm_email=true');
        }
      }
    } catch (err: any) {
      console.error('Erro completo:', err);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = 'Erro ao criar conta';
      
      if (err.message) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e as configurações do Supabase.';
        } else if (err.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
        } else if (err.message.includes('Password')) {
          errorMessage = 'A senha não atende aos requisitos mínimos.';
        } else if (err.message.includes('Email')) {
          errorMessage = 'Email inválido.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
              placeholder="Seu nome completo"
              required
            />
          </div>

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
              minLength={6}
            />
            <p className="text-xs text-gray-500">Mínimo de 6 caracteres</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Já tem uma conta? <span className="font-medium">Entrar</span>
            </Link>
          </div>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Ou continue com</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-gray-700 mr-2">🔍</span>
              <span className="text-sm text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-gray-700 mr-2">📘</span>
              <span className="text-sm text-gray-700">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

