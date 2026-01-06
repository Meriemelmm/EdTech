import { Router } from 'express';
import StudentController from '../controllers/studentController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

// GET

router.get('/class/:classId', authenticateToken, StudentController.getByClass);
router.get('/:id', authenticateToken, StudentController.getById);
router.get('/', authenticateToken, StudentController.getAll);

// POST
router.post(
  '/',
  authenticateToken,
  roleMiddleware(['ADMIN', 'TEACHER']),
  StudentController.create
);

// PUT
router.put(
  '/:id',
  authenticateToken,
  roleMiddleware(['ADMIN', 'TEACHER']),
  StudentController.update
);

// DELETE
router.delete(
  '/:id',
  authenticateToken,
  roleMiddleware(['ADMIN']),
  StudentController.delete
);

export default router;
