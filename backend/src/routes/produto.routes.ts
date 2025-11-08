import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';

const router = Router();
const produtoController = new ProdutoController();

router.get('/', produtoController.listar.bind(produtoController));
router.get('/:id', produtoController.buscarPorId.bind(produtoController));
router.get('/categoria/:categoria', produtoController.buscarPorCategoria.bind(produtoController));

export default router;

