import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtExpiresIn: '15m',
  jwtRefreshExpiresIn: '7d',
};
