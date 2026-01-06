import { Router } from 'express';
import SessionController from '../controllers/sessionController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/', authenticateToken, SessionController.getAll);
router.get('/:id', authenticateToken, SessionController.getById);
router.post('/', authenticateToken, roleMiddleware(['ADMIN','TEACHER']), SessionController.create);
router.put('/:id', authenticateToken, roleMiddleware(['ADMIN','TEACHER']), SessionController.update);
router.delete('/:id', authenticateToken, roleMiddleware(['ADMIN']), SessionController.delete);

export default router;
