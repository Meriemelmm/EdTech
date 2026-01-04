import { Router } from 'express';
import UserController from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

/**
 * Toutes les routes users nécessitent une authentification
 */
router.use(authenticateToken);

// ================= ROUTES AUTHENTIFIÉES =================

// GET /users?role=ADMIN - récupérer tous les users (filtre optionnel)
router.get(
  '/',
  roleMiddleware(['ADMIN']),
  UserController.getAllUsers.bind(UserController)
);


// GET /users/:id - récupérer un utilisateur par ID
router.get(
  '/:id',
  roleMiddleware(['ADMIN']),
  UserController.getById.bind(UserController)
);

// // ================= ROUTES ADMIN =================



// // DELETE /users/:id - supprimer un utilisateur
router.delete(
  '/:id',
  roleMiddleware(['ADMIN']),
  UserController.delete.bind(UserController)
);

export default router;
