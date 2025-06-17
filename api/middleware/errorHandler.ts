import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Erreur:', err);

  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Données invalides',
      details: err.message
    });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Token invalide'
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token expiré'
    });
    return;
  }

  res.status(500).json({
    error: 'Erreur interne du serveur'
  });
};
