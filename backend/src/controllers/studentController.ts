import { Request, Response } from 'express';
import { getPrismaInstance } from '../config/db';
import { CreateStudentBody, UpdateStudentBody } from '../types/student.type';

class StudentController {

  // =========================
  // CREATE STUDENT
  // =========================
  async create(
    req: Request<{}, {}, CreateStudentBody>,
    res: Response
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const { firstname, classId } = req.body;
      console.log("req,",req.body);

      if (!firstname || !classId) {
        return res.status(400).json({
          success: false,
          message: 'firstname et classId sont obligatoires',
        });
      }

      const classExists = await prisma.class.findUnique({
        where: { id: classId },
      });

      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: 'Classe non trouvée',
        });
      }

      const student = await prisma.student.create({
        data: { firstname, classId },
      });

      return res.status(201).json({
        success: true,
        message: 'Student créé avec succès',
        data: student,
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
  // GET ALL STUDENTS
  // =========================
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();

       const students = await prisma.student.findMany({
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
    });

      return res.status(200).json({
        success: true,
        data: students,
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
  // GET STUDENT BY ID
  // =========================
  async getById(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const id = parseInt(req.params.id);

     const student = await prisma.student.findUnique({
  where: { id },
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
    attendances: {
      include: {
        session: {
          select: {
            id: true,
            date: true,
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    },
  },
});


      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student non trouvé',
        });
      }

      return res.status(200).json({
        success: true,
        data: student,
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
  // GET STUDENTS BY CLASS
  // =========================
  async getByClass(
    req: Request<{ classId: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const classId = parseInt(req.params.classId);

      const students = await prisma.student.findMany({
        where: { classId },
        include: { class: true },
      });

      return res.status(200).json({
        success: true,
        data: students,
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
  // UPDATE STUDENT
  // =========================
  async update(
    req: Request<{ id: string }, {}, UpdateStudentBody>,
    res: Response
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const id = parseInt(req.params.id);
      const { firstname, classId } = req.body;

      const student = await prisma.student.findUnique({
        where: { id },
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student non trouvé',
        });
      }

      const updatedStudent = await prisma.student.update({
        where: { id },
        data: {
          ...(firstname && { firstname }),
          ...(classId && { classId }),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Student mis à jour',
        data: updatedStudent,
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
  // DELETE STUDENT
  // =========================
  async delete(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const id = parseInt(req.params.id);

      const student = await prisma.student.findUnique({
        where: { id },
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student non trouvé',
        });
      }

      await prisma.student.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Student supprimé avec succès',
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

export default new StudentController();
