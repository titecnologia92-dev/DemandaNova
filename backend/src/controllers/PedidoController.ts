import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { z } from 'zod';
import { handleError, AppError } from '../utils/errorHandler';

const criarPedidoSchema = z.object({
  itens: z.array(z.object({
    produto_id: z.string().uuid(),
    quantidade: z.number().int().positive(),
    preco_unitario: z.number().positive()
  })).min(1, 'Pedido deve ter pelo menos um item'),
  endereco_id: z.string().uuid().optional(),
  endereco: z.object({
    nome_completo: z.string().min(2),
    rua: z.string().min(5),
    cidade: z.string().min(2),
    cep: z.string().min(8),
    complemento: z.string().optional()
  }).optional()
}).refine(data => data.endereco_id || data.endereco, {
  message: 'Endereço é obrigatório'
});

export class PedidoController {
  async listar(req: AuthRequest, res: Response) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          itens_pedido (
            *,
            produtos (*)
          ),
          pagamentos (*)
        `)
        .eq('usuario_id', req.userId!)
        .order('created_at', { ascending: false });

      if (error) {
        throw new AppError('Erro ao buscar pedidos', 500);
      }

      res.json(data || []);
    } catch (error) {
      handleError(error as Error, res);
    }
  }

  async buscarPorId(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          itens_pedido (
            *,
            produtos (*)
          ),
          pagamentos (*)
        `)
        .eq('id', id)
        .eq('usuario_id', req.userId!)
        .single();

      if (error || !data) {
        throw new AppError('Pedido não encontrado', 404);
      }

      res.json(data);
    } catch (error) {
      handleError(error as Error, res);
    }
  }

  async criar(req: AuthRequest, res: Response) {
    try {
      const validatedData = criarPedidoSchema.parse(req.body);
      const userId = req.userId!;

      // Calcular total
      const total = validatedData.itens.reduce((sum, item) => {
        return sum + (item.preco_unitario * item.quantidade);
      }, 0);

      // Criar endereço se necessário
      let enderecoId = validatedData.endereco_id;
      if (!enderecoId && validatedData.endereco) {
        const { data: enderecoData, error: enderecoError } = await supabase
          .from('enderecos')
          .insert({
            usuario_id: userId,
            ...validatedData.endereco
          })
          .select()
          .single();

        if (enderecoError) {
          throw new AppError('Erro ao criar endereço', 500);
        }

        enderecoId = enderecoData.id;
      }

      // Criar pedido
      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          usuario_id: userId,
          status: 'pendente',
          total
        })
        .select()
        .single();

      if (pedidoError) {
        throw new AppError('Erro ao criar pedido', 500);
      }

      // Criar itens do pedido
      const itens = validatedData.itens.map(item => ({
        pedido_id: pedidoData.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        subtotal: item.preco_unitario * item.quantidade
      }));

      const { error: itensError } = await supabase
        .from('itens_pedido')
        .insert(itens);

      if (itensError) {
        // Rollback: deletar pedido criado
        await supabase.from('pedidos').delete().eq('id', pedidoData.id);
        throw new AppError('Erro ao criar itens do pedido', 500);
      }

      // Buscar pedido completo
      const { data: pedidoCompleto, error: fetchError } = await supabase
        .from('pedidos')
        .select(`
          *,
          itens_pedido (
            *,
            produtos (*)
          )
        `)
        .eq('id', pedidoData.id)
        .single();

      if (fetchError) {
        throw new AppError('Erro ao buscar pedido criado', 500);
      }

      res.status(201).json(pedidoCompleto);
    } catch (error) {
      handleError(error as Error, res);
    }
  }

  async cancelar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se o pedido pertence ao usuário
      const { data: pedido, error: fetchError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('id', id)
        .eq('usuario_id', req.userId!)
        .single();

      if (fetchError || !pedido) {
        throw new AppError('Pedido não encontrado', 404);
      }

      // Só pode cancelar se estiver pendente ou confirmado
      if (!['pendente', 'confirmado'].includes(pedido.status)) {
        throw new AppError('Pedido não pode ser cancelado neste status', 400);
      }

      const { data, error } = await supabase
        .from('pedidos')
        .update({ status: 'cancelado' })
        .eq('id', id)
        .eq('usuario_id', req.userId!)
        .select()
        .single();

      if (error) {
        throw new AppError('Erro ao cancelar pedido', 500);
      }

      res.json(data);
    } catch (error) {
      handleError(error as Error, res);
    }
  }
}

