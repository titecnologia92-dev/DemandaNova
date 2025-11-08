import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { handleError, AppError } from '../utils/errorHandler';

export class ProdutoController {
  async listar(req: Request, res: Response) {
    try {
      const { categoria, ativo } = req.query;
      
      let query = supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoria) {
        query = query.eq('categoria', categoria);
      }

      if (ativo !== undefined) {
        query = query.eq('ativo', ativo === 'true');
      } else {
        // Por padrão, só mostra produtos ativos
        query = query.eq('ativo', true);
      }

      const { data, error } = await query;

      if (error) {
        throw new AppError(`Erro ao buscar produtos: ${error.message || 'Erro desconhecido'}`, 500);
      }

      res.json(data || []);
    } catch (error) {
      console.error('Erro no controller de produtos:', error);
      handleError(error as Error, res);
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .single();

      if (error || !data) {
        throw new AppError('Produto não encontrado', 404);
      }

      res.json(data);
    } catch (error) {
      handleError(error as Error, res);
    }
  }

  async buscarPorCategoria(req: Request, res: Response) {
    try {
      const { categoria } = req.params;

      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('categoria', categoria)
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new AppError('Erro ao buscar produtos', 500);
      }

      res.json(data || []);
    } catch (error) {
      handleError(error as Error, res);
    }
  }
}

