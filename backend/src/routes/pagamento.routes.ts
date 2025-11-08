import { Router } from 'express';
import { PagamentoController } from '../controllers/PagamentoController';
import { authenticate } from '../middleware/auth';

const router = Router();
const pagamentoController = new PagamentoController();

router.use(authenticate);
router.post('/processar', pagamentoController.processar.bind(pagamentoController));

export default router;

