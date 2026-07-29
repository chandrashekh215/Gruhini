import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'GruhaniSuperSecretKeyForJwtTokenGeneration2026';

export interface JwtClaimsPayload {
  jwtClaims: {
    userid: number;
    roles: string[];
  };
  sub?: string;
}

export function generateJwtToken(userId: number, email: string, roles: string[]): string {
  const payload: JwtClaimsPayload = {
    jwtClaims: {
      userid: userId,
      roles: roles,
    },
    sub: email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '10h',
  });
}

export function verifyJwtToken(token: string): JwtClaimsPayload {
  return jwt.verify(token, JWT_SECRET) as JwtClaimsPayload;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
