import { Request, Response, NextFunction } from 'express';
import {getPrismaInstance} from '../config/db';

import { RegisterBody, LoginBody } from '../types/auth.type';

import bcrypt from 'bcryptjs';
import  {generateToken} from '../utils/jwt'
const prisma = getPrismaInstance();
class AuthController {

  // ================= REGISTER =================
  async register(
    req: Request<{}, {}, RegisterBody>,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe obligatoires'
        });
      }

      const userExists = await prisma.user.findUnique({
        where: { email }
      });

      if (userExists) {
        return res.status(409).json({
          success: false,
          message: 'Utilisateur déjà existant'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          
        }
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Server Error',
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
          email: user.email,
          role: user.role,
          token
        }
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }
}

export default new AuthController();
