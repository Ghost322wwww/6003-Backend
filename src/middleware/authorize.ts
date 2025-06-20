/// <reference path="../../types/express/index.d.ts" />

import { RequestHandler } from 'express';

export const authorizeRole = (role: 'operator' | 'user'): RequestHandler => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      return;
    }
    next();
  };
};
