import { Request, Response, NextFunction } from 'express';
import { getPrismaInstance } from '../config/db';
import { RegisterBody, LoginBody } from '../types/auth.type';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

class AuthController {

  // ================= REGISTER =================
  async register(
    req: Request<{}, {}, RegisterBody>,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
      console.log("regiter data ",req.body);
    try {
      const prisma = getPrismaInstance();
    
      const { firstname, lastname, email, password, role } = req.body;

      // Validation
      if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs sont obligatoires'
        });
      }

      // Vérifier existence
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Utilisateur déjà existant'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création user
      const user = await prisma.user.create({
        data: {
          firstname,
          lastname,
          email,
          password: hashedPassword,
          role: role ?? 'STUDENT'
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role
        }
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  // ================= LOGIN =================
  async login(
    req: Request<{}, {}, LoginBody>,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis'
        });
      }

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      const token = generateToken({
        userId: user.id,
        role: user.role
      });

      return res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          token
        }
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
  // ================= ME =================
  async me(req: Request, res: Response): Promise<Response> {
    try {
      const prisma = getPrismaInstance();
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
}

export default new AuthController();
