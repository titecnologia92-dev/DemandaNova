import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController';
import { authenticate } from '../middleware/auth';

const router = Router();
const pedidoController = new PedidoController();

router.use(authenticate);
router.get('/', pedidoController.listar.bind(pedidoController));
router.get('/:id', pedidoController.buscarPorId.bind(pedidoController));
router.post('/', pedidoController.criar.bind(pedidoController));
router.put('/:id/cancelar', pedidoController.cancelar.bind(pedidoController));

export default router;

