import { Request, Response } from 'express';
import { getPrismaInstance } from '../config/db';
import { CreateSubjectBody, UpdateSubjectBody } from '../types/subject.type';

class SubjectController {

  // =========================
  // CREATE SUBJECT
  // =========================
  async create(
    req: Request<{}, {}, CreateSubjectBody>,
    res: Response
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Le nom du subject est obligatoire',
        });
      }

      const subject = await prisma.subject.create({
        data: { name },
      });

      return res.status(201).json({
        success: true,
        message: 'Subject créé avec succès',
        data: subject,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message,
      });
    }
  }

  // =========================
  // GET ALL SUBJECTS
  // =========================
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();

      const subjects = await prisma.subject.findMany({
        include: {
          sessions: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: subjects,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message,
      });
    }
  }

  // =========================
  // GET SUBJECT BY ID
  // =========================
  async getById(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const id = parseInt(req.params.id);

      const subject = await prisma.subject.findUnique({
        where: { id },
        include: {
          sessions: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                  manager: {
                    select: {
                      id: true,
                      firstname: true,
                      lastname: true,
                      email: true,
                      role: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject non trouvé',
        });
      }

      return res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message,
      });
    }
  }

  // =========================
  // UPDATE SUBJECT
  // =========================
  async update(
    req: Request<{ id: string }, {}, UpdateSubjectBody>,
    res: Response
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const id = parseInt(req.params.id);
      const { name } = req.body;

      const subject = await prisma.subject.findUnique({
        where: { id },
      });

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject non trouvé',
        });
      }

      const updatedSubject = await prisma.subject.update({
        where: { id },
        data: {
          ...(name && { name }),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Subject mis à jour',
        data: updatedSubject,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message,
      });
    }
  }

  // =========================
  // DELETE SUBJECT
  // =========================
  async delete(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const id = parseInt(req.params.id);

      const subject = await prisma.subject.findUnique({
        where: { id },
      });

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject non trouvé',
        });
      }

      await prisma.subject.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Subject supprimé avec succès',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message,
      });
    }
  }
}

export default new SubjectController();
