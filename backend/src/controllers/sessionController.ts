import { Request, Response } from 'express';
import { getPrismaInstance } from '../config/db';
import { CreateSessionBody, UpdateSessionBody } from '../types/session.type';

class SessionController {

  // =========================
  // CREATE SESSION
  // =========================
  async create(req: Request<{}, {}, CreateSessionBody>, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const { date, classId, subjectId, teacherId } = req.body;

      if (!date || !classId || !subjectId || !teacherId) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' });
      }

      const session = await prisma.session.create({
        data: {
          date: new Date(date),
          classId,
          subjectId,
          teacherId,
        },
      });

      return res.status(201).json({ success: true, message: 'Session créée', data: session });

    } catch (error: any) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // =========================
  // GET ALL SESSIONS
  // =========================
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();

      const sessions = await prisma.session.findMany({
        include: {
          class: { select: { id: true, name: true, manager: { select: { id: true, firstname: true, lastname: true, email: true } } } },
          subject: true,
          attendances: {
            include: { student: true },
          },
        },
      });

      return res.status(200).json({ success: true, data: sessions });

    } catch (error: any) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // =========================
  // GET SESSION BY ID
  // =========================
  async getById(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const id = parseInt(req.params.id);

      const session = await prisma.session.findUnique({
        where: { id },
        include: {
          class: { select: { id: true, name: true, manager: { select: { id: true, firstname: true, lastname: true } } } },
          subject: true,
          attendances: { include: { student: true } },
        },
      });

      if (!session) return res.status(404).json({ success: false, message: 'Session non trouvée' });

      return res.status(200).json({ success: true, data: session });

    } catch (error: any) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  // =========================
  // UPDATE SESSION
  // =========================
  async update(
    req: Request<{ id: string }, {}, UpdateSessionBody>,
    res: Response
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const id = parseInt(req.params.id);
      const { date, classId, subjectId, teacherId } = req.body;

      // Vérifier si la session existe
      const session = await prisma.session.findUnique({ where: { id } });
      if (!session) {
        return res.status(404).json({ success: false, message: 'Session non trouvée' });
      }

      // Vérifier classId si fourni
      if (classId) {
        const classExists = await prisma.class.findUnique({ where: { id: classId } });
        if (!classExists) {
          return res.status(404).json({ success: false, message: 'Classe non trouvée' });
        }
      }

      // Vérifier subjectId si fourni
      if (subjectId) {
        const subjectExists = await prisma.subject.findUnique({ where: { id: subjectId } });
        if (!subjectExists) {
          return res.status(404).json({ success: false, message: 'Subject non trouvé' });
        }
      }

      // Vérifier teacherId si fourni
      if (teacherId) {
        const teacherExists = await prisma.user.findUnique({ where: { id: teacherId } });
        if (!teacherExists) {
          return res.status(404).json({ success: false, message: 'Teacher non trouvé' });
        }
      }

      // Update session
      const updatedSession = await prisma.session.update({
        where: { id },
        data: {
          ...(date && { date: new Date(date) }),
          ...(classId && { classId }),
          ...(subjectId && { subjectId }),
          ...(teacherId && { teacherId }),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Session mise à jour',
        data: updatedSession,
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
  // DELETE SESSION
  // =========================
  async delete(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const id = parseInt(req.params.id);

      const session = await prisma.session.findUnique({ where: { id } });
      if (!session) return res.status(404).json({ success: false, message: 'Session non trouvée' });

      await prisma.session.delete({ where: { id } });

      return res.status(200).json({ success: true, message: 'Session supprimée' });

    } catch (error: any) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

}

export default new SessionController();
