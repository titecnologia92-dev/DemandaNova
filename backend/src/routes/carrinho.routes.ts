import { Router } from 'express';
import { CarrinhoController } from '../controllers/CarrinhoController';
import { authenticate } from '../middleware/auth';

const router = Router();
const carrinhoController = new CarrinhoController();

router.use(authenticate);
router.get('/', carrinhoController.obter.bind(carrinhoController));
router.post('/adicionar', carrinhoController.adicionar.bind(carrinhoController));
router.put('/atualizar', carrinhoController.atualizar.bind(carrinhoController));
router.delete('/remover/:itemId', carrinhoController.remover.bind(carrinhoController));
router.delete('/limpar', carrinhoController.limpar.bind(carrinhoController));

export default router;

