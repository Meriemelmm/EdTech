import { Router } from 'express';
import SubjectController from '../controllers/subjectController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

// GET
router.get('/', authenticateToken, SubjectController.getAll);
router.get('/:id', authenticateToken, SubjectController.getById);

// POST
router.post(
  '/',
  authenticateToken,
  roleMiddleware(['ADMIN', 'TEACHER']),
  SubjectController.create
);

// PUT
router.put(
  '/:id',
  authenticateToken,
  roleMiddleware(['ADMIN', 'TEACHER']),
  SubjectController.update
);

// DELETE
router.delete(
  '/:id',
  authenticateToken,
  roleMiddleware(['ADMIN']),
  SubjectController.delete
);

export default router;
