'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // Páginas que não devem mostrar o header global
  const hideHeaderPaths = ['/login', '/registro', '/carrinho', '/checkout', '/pedido'];
  const shouldHideHeader = hideHeaderPaths.some(path => pathname?.startsWith(path));

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (shouldHideHeader) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 md:px-6 lg:px-8 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-lg md:text-xl font-semibold text-gray-800">
          Sweet Delights
        </Link>
        <div className="flex items-center gap-3 md:gap-4">
          {user ? (
            <>
              <Link href="/carrinho" className="text-gray-700 text-lg md:text-xl hover:text-gray-900 transition-colors">
                🛒
              </Link>
              <button onClick={handleLogout} className="text-sm md:text-base text-gray-600 hover:text-gray-800 transition-colors">
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm md:text-base text-gray-600 hover:text-gray-800 transition-colors">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

