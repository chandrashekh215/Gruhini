import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken } from '../utils/auth.js';
import { prisma } from '../lib/prisma.js';

export interface AuthenticatedUser {
  id: number;
  email: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const claims = verifyJwtToken(token);
    const userId = claims.jwtClaims.userid;

    const user = await prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const roles = user.role.map((r) => r.toString());

    req.user = {
      id: Number(user.id),
      email: user.email,
      roles: roles,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    next();
  };
}
