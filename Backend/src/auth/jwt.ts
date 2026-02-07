import jwt, { Secret, SignOptions } from 'jsonwebtoken';

import { formatJwtTimesInIST } from "../utils/time";

export type JwtUserPayload = {
  sub: string; // user id
  email: string;
};

export type JwtPayload = {
  iat: number; // issued at (epoch seconds)
  exp: number; // expiration time (epoch seconds) 
}

function getJwtSecret(): Secret {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Fail fast so you don't accidentally run with unsigned/weak auth
    throw new Error('JWT_SECRET is not defined in .env');
  }
  return secret;
}

export function signAccessToken(payload: JwtUserPayload): string {
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ?? '10m'
  };

   const jwtReturn = jwt.sign(payload, getJwtSecret(), options);
   
  //  console.log("Generated JWT:", jwtReturn);
   const decoded = jwt.decode(jwtReturn);
   console.log("Decoded JWT payload:", decoded);

  if (decoded && typeof decoded !== 'string') {
    const { iat, exp } = decoded as JwtPayload;

    if (typeof iat === 'number' && typeof exp === 'number') {
      const jwtTimesInIST = formatJwtTimesInIST({ iat, exp });
      console.log('JWT times in IST:', jwtTimesInIST);
    } else {
      console.log('JWT decode: missing iat/exp');
    }
  } else {
    console.log('JWT decode failed or returned a string');
  }

   return jwtReturn;
}

export function verifyAccessToken(token: string): JwtUserPayload {
  return jwt.verify(token, getJwtSecret(), {
    algorithms: ['HS256']
  }) as JwtUserPayload;
}

