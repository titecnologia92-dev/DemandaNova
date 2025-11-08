import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { z } from 'zod';
import { handleError, AppError } from '../utils/errorHandler';

const criarAvaliacaoSchema = z.object({
  produto_id: z.string().uuid('ID do produto inválido'),
  pedido_id: z.string().uuid().optional(),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().optional()
});

export class AvaliacaoController {
  async listarPorProduto(req: Request, res: Response) {
    try {
      const { produtoId } = req.params;

      const { data, error } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('produto_id', produtoId)
        .order('created_at', { ascending: false });

      if (error) {
        // Se não houver avaliações, retorna array vazio em vez de erro
        if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
          return res.json([]);
        }
        
        throw new AppError(`Erro ao buscar avaliações: ${error.message}`, 500);
      }

      res.json(data || []);
    } catch (error) {
      handleError(error as Error, res);
    }
  }

  async criar(req: AuthRequest, res: Response) {
    try {
      const validatedData = criarAvaliacaoSchema.parse(req.body);
      const userId = req.userId!;

      // Verificar se o pedido pertence ao usuário (se fornecido)
      if (validatedData.pedido_id) {
        const { data: pedido, error: pedidoError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('id', validatedData.pedido_id)
          .eq('usuario_id', userId)
          .single();

        if (pedidoError || !pedido) {
          throw new AppError('Pedido não encontrado', 404);
        }
      }

      // Verificar se já existe avaliação para este produto e pedido
      if (validatedData.pedido_id) {
        const { data: avaliacaoExistente } = await supabase
          .from('avaliacoes')
          .select('*')
          .eq('produto_id', validatedData.produto_id)
          .eq('pedido_id', validatedData.pedido_id)
          .eq('usuario_id', userId)
          .single();

        if (avaliacaoExistente) {
          throw new AppError('Você já avaliou este produto para este pedido', 400);
        }
      }

      const { data, error } = await supabase
        .from('avaliacoes')
        .insert({
          produto_id: validatedData.produto_id,
          usuario_id: userId,
          pedido_id: validatedData.pedido_id || null,
          nota: validatedData.nota,
          comentario: validatedData.comentario || null
        })
        .select()
        .single();

      if (error) {
        throw new AppError('Erro ao criar avaliação', 500);
      }

      res.status(201).json(data);
    } catch (error) {
      handleError(error as Error, res);
    }
  }
}

