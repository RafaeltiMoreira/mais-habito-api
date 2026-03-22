import { Request, Response, NextFunction } from 'express';
import { DatabaseError } from 'pg';
import { AppError } from '../errors/AppError';

const postgresErrorMessages: Record<string, string> = {
  '3D000': 'Banco de dados não encontrado. Verifique DB_NAME e se o banco foi criado.',
  '28P01': 'Falha de autenticação no banco de dados. Verifique DB_USER e DB_PASSWORD.',
  ECONNREFUSED: 'Não foi possível conectar ao PostgreSQL. Verifique se o serviço está ativo.',
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Se for um AppError (nossos erros customizados)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  const pgCode = (err as Partial<DatabaseError> & { code?: string }).code;
  if (pgCode && postgresErrorMessages[pgCode]) {
    return res.status(500).json({
      error: postgresErrorMessages[pgCode],
    });
  }

  // Se for um erro desconhecido (não tratado)
  console.error('Unexpected error:', err);
  
  return res.status(500).json({
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error'
  });
};