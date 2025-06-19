import { Request, Response, NextFunction } from 'express';

export const authorizeRole = (requiredRole: 'operator' | 'user') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || user.role !== requiredRole) {
      res.status(403).json({ error: 'Access denied: insufficient privileges' });
      return;
    }

    next();
  };
};
