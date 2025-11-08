'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ErroPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tipo = searchParams.get('tipo') || 'geral';

  const erroConfig = {
    login: {
      titulo: 'Erro de Login',
      mensagem: 'Credenciais incorretas',
      descricao: 'Por favor, verifique seu email e senha e tente novamente.',
      acao: 'Tentar Novamente',
      acaoSecundaria: 'Esqueci minha senha'
    },
    pagamento: {
      titulo: 'Falha no Pagamento',
      mensagem: 'Não foi possível processar seu pagamento',
      descricao: 'Verifique os dados do cartão ou tente outro método de pagamento.',
      acao: 'Tentar Novamente',
      acaoSecundaria: 'Escolher outro método'
    },
    geral: {
      titulo: 'Ocorreu um Erro',
      mensagem: 'Algo deu errado',
      descricao: 'Por favor, tente novamente mais tarde.',
      acao: 'Voltar',
      acaoSecundaria: 'Ir para Home'
    }
  };

  const config = erroConfig[tipo as keyof typeof erroConfig] || erroConfig.geral;

  return (
    <div className="w-full bg-gray-50 p-4 md:p-6 lg:p-8 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <div className="text-4xl md:text-5xl lg:text-6xl text-gray-400 mb-4">
            {tipo === 'login' ? '⚠️' : tipo === 'pagamento' ? '❌' : '⚠️'}
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl text-gray-800 font-semibold">{config.titulo}</h2>
        </div>
        <div className="text-center mb-6 md:mb-8">
          <p className="text-base md:text-lg text-gray-600 mb-2">{config.mensagem}</p>
          <p className="text-sm md:text-base text-gray-500">{config.descricao}</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-800 text-white py-3 md:py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            {config.acao}
          </button>
          <Link
            href={tipo === 'login' ? '/login' : '/'}
            className="block w-full bg-white text-gray-600 py-3 md:py-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-center transition-colors font-medium"
          >
            {config.acaoSecundaria}
          </Link>
        </div>
      </div>
    </div>
  );
}

