import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../utils/jwt';

// Extension de l'interface Request pour inclure user
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token d\'authentification manquant'
        });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token invalide ou expiré'
        });
    }
};
