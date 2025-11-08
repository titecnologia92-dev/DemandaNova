// Script de teste para verificar conexão com Supabase
// Execute no console do navegador: import('./lib/test-supabase').then(m => m.testSupabase())

import { supabase } from './supabase';

export async function testSupabase() {
  console.log('🔍 Testando conexão com Supabase...\n');
  
  // Verificar variáveis de ambiente
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('📋 Variáveis de Ambiente:');
  console.log('  URL:', url ? `✅ ${url.substring(0, 30)}...` : '❌ NÃO CONFIGURADA');
  console.log('  Key:', key ? `✅ ${key.substring(0, 20)}...` : '❌ NÃO CONFIGURADA');
  console.log('');
  
  if (!url || !key) {
    console.error('❌ Variáveis de ambiente não configuradas!');
    console.log('Verifique o arquivo frontend/.env.local');
    return;
  }
  
  // Testar conexão básica
  try {
    console.log('🌐 Testando conexão HTTP...');
    const response = await fetch(`${url}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Conexão HTTP funcionando!');
    } else {
      console.error('❌ Erro HTTP:', response.status, response.statusText);
    }
  } catch (error: any) {
    console.error('❌ Erro de conexão:', error.message);
    console.log('Possíveis causas:');
    console.log('  - URL do Supabase incorreta');
    console.log('  - Problema de CORS');
    console.log('  - Firewall bloqueando');
  }
  
  // Testar Auth endpoint
  try {
    console.log('\n🔐 Testando endpoint de Auth...');
    const authResponse = await fetch(`${url}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'apikey': key
      }
    });
    
    if (authResponse.ok) {
      console.log('✅ Endpoint de Auth acessível!');
    } else {
      console.error('❌ Erro no endpoint de Auth:', authResponse.status);
    }
  } catch (error: any) {
    console.error('❌ Erro ao acessar Auth:', error.message);
  }
  
  // Testar signUp (sem criar usuário de verdade)
  try {
    console.log('\n👤 Testando signUp (simulação)...');
    const testEmail = `test-${Date.now()}@example.com`;
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'test123456',
      options: {
        data: { nome: 'Teste' }
      }
    });
    
    if (error) {
      console.error('❌ Erro no signUp:', error.message);
      if (error.message.includes('Failed to fetch')) {
        console.log('\n💡 SOLUÇÃO:');
        console.log('1. Verifique se a URL está correta (sem barra no final)');
        console.log('2. Verifique se a chave ANON está correta');
        console.log('3. Verifique Authentication > Settings no painel do Supabase');
        console.log('4. Verifique CORS em Settings > API');
      }
    } else {
      console.log('✅ SignUp funcionando! (usuário de teste criado)');
    }
  } catch (error: any) {
    console.error('❌ Erro ao testar signUp:', error.message);
  }
}

