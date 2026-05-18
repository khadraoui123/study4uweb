import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AuthPayload } from '../types/index.js';

export function generateAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
}

export function generateRefreshToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn as any });
}

export function verifyRefreshToken(token: string): AuthPayload {
  return jwt.verify(token, config.jwtRefreshSecret) as AuthPayload;
}
