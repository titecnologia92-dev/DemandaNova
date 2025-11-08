'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthErrorHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Garantir que só executa no cliente após hidratação
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Listener global para erros de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Se a sessão foi invalidada (ex: refresh token inválido)
      if (event === 'SIGNED_OUT' && !session) {
        // Redirecionar para login se não estiver em página pública
        const publicPaths = ['/login', '/registro', '/'];
        const currentPath = window.location.pathname;
        if (!publicPaths.includes(currentPath)) {
          router.push('/login');
        }
      }

      // Tratar erros de token
      if (event === 'TOKEN_REFRESHED' && !session) {
        // Token não pôde ser renovado, fazer logout
        await supabase.auth.signOut();
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login')) {
          router.push('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, mounted]);

  return null;
}

