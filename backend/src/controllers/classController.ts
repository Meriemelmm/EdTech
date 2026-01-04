import { Request, Response } from 'express';
import { getPrismaInstance } from '../config/db';
import { CreateClassBody, UpdateClassBody } from '../types/class.types';

class ClassController {
  
  // ================= CREATE CLASS =================
  async create(
    req: Request<{}, {}, CreateClassBody>,
    res: Response
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const { name, managerId } = req.body;

      // Validation
      if (!name || !managerId) {
        return res.status(400).json({
          success: false,
          message: 'Le nom et le managerId sont obligatoires'
        });
      }

      // Vérifier si le manager existe et a le bon rôle
      const manager = await prisma.user.findUnique({
        where: { id: managerId }
      });

      if (!manager) {
        return res.status(404).json({
          success: false,
          message: 'Manager non trouvé'
        });
      }

      if (manager.role !== 'TEACHER' && manager.role !== 'ADMIN') {
        return res.status(400).json({
          success: false,
          message: 'Le manager doit être un TEACHER ou ADMIN'
        });
      }

      // Vérifier si le manager a déjà une classe
      const existingClass = await prisma.class.findUnique({
        where: { managerId }
      });

      if (existingClass) {
        return res.status(409).json({
          success: false,
          message: 'Ce manager gère déjà une classe'
        });
      }

      // Créer la classe
      const newClass = await prisma.class.create({
        data: { 
          name, 
          managerId 
        },
        include: {
          manager: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              role: true
            }
          }
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Classe créée avec succès',
        data: newClass
      });
    } catch (error: any) {
      console.error('Create class error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  // ================= GET ALL CLASSES =================
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();

      const classes = await prisma.class.findMany({
        include: {
          manager: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              role: true
            }
          },
          _count: {
            select: {
              students: true,
              sessions: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      return res.status(200).json({
        success: true,
        data: classes
      });
    } catch (error: any) {
      console.error('Get all classes error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  // ================= GET CLASS BY ID =================
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const { id } = req.params;

      const classData = await prisma.class.findUnique({
        where: { id: parseInt(id) },
        include: {
          manager: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              role: true
            }
          },
          students: {
            select: {
              id: true,
              firstname: true,
              classId: true
            }
          },
          sessions: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              date: 'desc'
            }
          },
          _count: {
            select: {
              students: true,
              sessions: true
            }
          }
        }
      });

      if (!classData) {
        return res.status(404).json({
          success: false,
          message: 'Classe non trouvée'
        });
      }

      return res.status(200).json({
        success: true,
        data: classData
      });
    } catch (error: any) {
      console.error('Get class by id error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

 

  // ================= UPDATE CLASS =================
  async update(
    req: Request<{ id: string }, {}, UpdateClassBody>,
    res: Response
  ): Promise<Response> {
    console.log("params",req.params);
    try {
      const prisma = getPrismaInstance();
      const { id } = req.params;
      const { name, managerId } = req.body;

      // Vérifier si la classe existe
      const existingClass = await prisma.class.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingClass) {
        return res.status(404).json({
          success: false,
          message: 'Classe non trouvée'
        });
      }

      // Si on change le manager
      if (managerId && managerId !== existingClass.managerId) {
        // Vérifier que le nouveau manager existe
        const newManager = await prisma.user.findUnique({
          where: { id: managerId }
        });

        if (!newManager) {
          return res.status(404).json({
            success: false,
            message: 'Nouveau manager non trouvé'
          });
        }

        if (newManager.role !== 'TEACHER' && newManager.role !== 'ADMIN') {
          return res.status(400).json({
            success: false,
            message: 'Le manager doit être un TEACHER ou ADMIN'
          });
        }

        // Vérifier que le nouveau manager n'a pas déjà une classe
        const managerHasClass = await prisma.class.findUnique({
          where: { managerId }
        });

        if (managerHasClass) {
          return res.status(409).json({
            success: false,
            message: 'Ce manager gère déjà une autre classe'
          });
        }
      }

      // Mise à jour
      const updatedClass = await prisma.class.update({
        where: { id: parseInt(id) },
        data: {
          ...(name && { name }),
          ...(managerId && { managerId })
        },
        include: {
          manager: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              role: true
            }
          },
          _count: {
            select: {
              students: true,
              sessions: true
            }
          }
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Classe mise à jour avec succès',
        data: updatedClass
      });
    } catch (error: any) {
      console.error('Update class error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  // ================= DELETE CLASS =================
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const { id } = req.params;

      // Vérifier si la classe existe
      const existingClass = await prisma.class.findUnique({
        where: { id: parseInt(id) },
        include: {
          _count: {
            select: {
              students: true,
              sessions: true
            }
          }
        }
      });

      if (!existingClass) {
        return res.status(404).json({
          success: false,
          message: 'Classe non trouvée'
        });
      }

      // Vérifier s'il y a des étudiants ou sessions
      if (existingClass._count.students > 0) {
        return res.status(400).json({
          success: false,
          message: `Impossible de supprimer une classe avec ${existingClass._count.students} étudiant(s)`
        });
      }

      if (existingClass._count.sessions > 0) {
        return res.status(400).json({
          success: false,
          message: `Impossible de supprimer une classe avec ${existingClass._count.sessions} session(s)`
        });
      }

      // Suppression
      await prisma.class.delete({
        where: { id: parseInt(id) }
      });

      return res.status(200).json({
        success: true,
        message: 'Classe supprimée avec succès'
      });
    } catch (error: any) {
      console.error('Delete class error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  
}

export default new ClassController();