'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          // Se houver erro (ex: refresh token inválido), limpar sessão
          if (error.message.includes('refresh_token') || error.message.includes('Invalid Refresh Token')) {
            supabase.auth.signOut();
            setUser(null);
          }
        } else {
          setUser(session?.user ?? null);
        }
        setLoading(false);
      })
      .catch(() => {
        // Em caso de erro, limpar e continuar
        setUser(null);
        setLoading(false);
      });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Tratar eventos de erro de token
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    loading,
    signOut
  };
}

