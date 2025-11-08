import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { z } from 'zod';
import { handleError, AppError } from '../utils/errorHandler';

const processarPagamentoSchema = z.object({
  pedido_id: z.string().uuid('ID do pedido inválido'),
  metodo: z.enum(['cartao_credito', 'paypal', 'apple_pay', 'pix']),
  dados_pagamento: z.record(z.any()).optional()
});

export class PagamentoController {
  async processar(req: AuthRequest, res: Response) {
    try {
      const validatedData = processarPagamentoSchema.parse(req.body);
      const userId = req.userId!;

      // Verificar se o pedido pertence ao usuário
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('id', validatedData.pedido_id)
        .eq('usuario_id', userId)
        .single();

      if (pedidoError || !pedido) {
        throw new AppError('Pedido não encontrado', 404);
      }

      // Verificar se já existe pagamento para este pedido
      const { data: pagamentoExistente } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('pedido_id', validatedData.pedido_id)
        .single();

      if (pagamentoExistente && pagamentoExistente.status === 'aprovado') {
        throw new AppError('Pedido já foi pago', 400);
      }

      // Simular processamento de pagamento
      // Em produção, aqui seria feita a integração com gateway de pagamento
      const statusPagamento = 'aprovado'; // Simulado - sempre aprova
      const transacaoId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Criar ou atualizar pagamento
      let pagamento;
      if (pagamentoExistente) {
        const { data, error } = await supabase
          .from('pagamentos')
          .update({
            metodo: validatedData.metodo,
            status: statusPagamento,
            transacao_id: transacaoId,
            dados_pagamento: validatedData.dados_pagamento || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', pagamentoExistente.id)
          .select()
          .single();

        if (error) {
          throw new AppError('Erro ao atualizar pagamento', 500);
        }

        pagamento = data;
      } else {
        const { data, error } = await supabase
          .from('pagamentos')
          .insert({
            pedido_id: validatedData.pedido_id,
            metodo: validatedData.metodo,
            status: statusPagamento,
            valor: pedido.total,
            transacao_id: transacaoId,
            dados_pagamento: validatedData.dados_pagamento || null
          })
          .select()
          .single();

        if (error) {
          throw new AppError('Erro ao processar pagamento', 500);
        }

        pagamento = data;
      }

      // Atualizar status do pedido para confirmado
      if (statusPagamento === 'aprovado') {
        await supabase
          .from('pedidos')
          .update({ status: 'confirmado' })
          .eq('id', validatedData.pedido_id);
      }

      res.json({
        message: 'Pagamento processado com sucesso',
        pagamento
      });
    } catch (error) {
      handleError(error as Error, res);
    }
  }
}

