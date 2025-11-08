import { Router } from 'express';
import authRoutes from './auth.routes';
import produtoRoutes from './produto.routes';
import carrinhoRoutes from './carrinho.routes';
import pedidoRoutes from './pedido.routes';
import pagamentoRoutes from './pagamento.routes';
import avaliacaoRoutes from './avaliacao.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/produtos', produtoRoutes);
router.use('/carrinho', carrinhoRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/pagamentos', pagamentoRoutes);
router.use('/avaliacoes', avaliacaoRoutes);

export default router;

