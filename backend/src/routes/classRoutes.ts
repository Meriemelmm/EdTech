import { Router } from 'express';
import ClassController from '../controllers/classController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

// ============ ROUTES PUBLIQUES (tous les utilisateurs authentifiés) ============

// GET /classes - Récupérer toutes les classes
router.get('/', ClassController.getAll.bind(ClassController));



// ⭐ Route générique EN DERNIER
// GET /classes/:id - Récupérer une classe par ID
router.get('/:id', ClassController.getById.bind(ClassController));

// ============ ROUTES ADMIN + TEACHER ============

// POST /classes - Créer une nouvelle classe
router.post(
  '/',
  roleMiddleware(['ADMIN', 'TEACHER']),
  ClassController.create.bind(ClassController)
);

// PUT /classes/:id - Mettre à jour une classe
router.put(
  '/:id',
  roleMiddleware(['ADMIN', 'TEACHER']),
  ClassController.update.bind(ClassController)
);

// ============ ROUTES ADMIN UNIQUEMENT ============

// DELETE /classes/:id - Supprimer une classe
router.delete(
  '/:id',
  roleMiddleware(['ADMIN']),
  ClassController.delete.bind(ClassController)
);

export default router;