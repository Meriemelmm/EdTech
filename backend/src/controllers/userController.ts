import { Request, Response } from 'express';
import { getPrismaInstance } from '../config/db';
import bcrypt from 'bcryptjs';

class UserController {
  
  // ================= GET ALL USERS =================
  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const { role } = req.query;

      const users = await prisma.user.findMany({
        where: role ? { role: role as any } : undefined,
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          createdAt: true,
          managedClass: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      console.log("users",users);

      return res.status(200).json({
        success: true,
        data: users
      });
    } catch (error: any) {
      console.error('Get all users error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  // ================= GET USER BY ID =================
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          createdAt: true,
          managedClass: {
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  students: true,
                  sessions: true
                }
              }
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      console.error('Get user by id error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

 

  // ================= DELETE USER =================
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const { id } = req.params;
     
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          managedClass: true
        }
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      if (existingUser.managedClass) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de supprimer un utilisateur qui gère une classe'
        });
      }

      await prisma.user.delete({
        where: { id: parseInt(id) }
      });

      return res.status(200).json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error: any) {
      console.error('Delete user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
}

export default new UserController();