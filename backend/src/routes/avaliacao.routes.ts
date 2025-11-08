import { Router } from 'express';
import { AvaliacaoController } from '../controllers/AvaliacaoController';
import { authenticate } from '../middleware/auth';

const router = Router();
const avaliacaoController = new AvaliacaoController();

router.get('/produto/:produtoId', avaliacaoController.listarPorProduto.bind(avaliacaoController));
router.use(authenticate);
router.post('/', avaliacaoController.criar.bind(avaliacaoController));

export default router;

