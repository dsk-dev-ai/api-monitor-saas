import { Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { AppError } from './error';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      throw new AppError('Invalid or expired token', 401);
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        subscription: true,
      },
    });

    if (!dbUser) {
      throw new AppError('User account not found', 404);
    }

    const isAccountActive =
      (dbUser as { isActive?: boolean; active?: boolean; is_active?: boolean })
        .isActive ??
      (dbUser as { isActive?: boolean; active?: boolean; is_active?: boolean })
        .active ??
      (dbUser as { isActive?: boolean; active?: boolean; is_active?: boolean })
        .is_active ??
      true;

    if (!isAccountActive) {
      throw new AppError('Account disabled', 403);
    }

    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name || undefined,
      avatar: dbUser.avatar || undefined,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser(token);

    if (user) {
      req.user = {
        id: user.id,
        email: user.email!,
      };
    }

    next();
  } catch {
    next();
  }
};
