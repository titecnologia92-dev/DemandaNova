import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { z } from 'zod';
import { handleError, AppError } from '../utils/errorHandler';

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres')
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            nome: validatedData.nome
          }
        }
      });

      if (error) {
        throw new AppError(error.message, 400);
      }

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: data.user?.id,
          email: data.user?.email
        }
      });
    } catch (error) {
      handleError(error as Error, res);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password
      });

      if (error) {
        throw new AppError('Credenciais inválidas', 401);
      }

      res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: data.user.id,
          email: data.user.email,
          nome: data.user.user_metadata?.nome
        },
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token
        }
      });
    } catch (error) {
      handleError(error as Error, res);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        throw new AppError('Refresh token é obrigatório', 400);
      }

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token
      });

      if (error) {
        throw new AppError('Token inválido', 401);
      }

      res.json({
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token
        }
      });
    } catch (error) {
      handleError(error as Error, res);
    }
  }
}

