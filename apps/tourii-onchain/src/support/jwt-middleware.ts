import { JwtRepository } from '@app/core/domain/auth/jwt.repository';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtRepository: JwtRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    try {
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  async userIsAlreadyLoggedIn(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const data = await this.jwtRepository.dataFromToken(token);

        if (data) {
          res.clearCookie('token');
          return res.status(400).json({ message: 'User is already logged in' });
        }
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    }

    next();
  }

  async userIsLoggedIn(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    try {
      const data = await this.jwtRepository.dataFromToken(token);
      if (data) {
        req.user = data;
        next();
      } else {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  async verifyExistingJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const tokenValue = await this.jwtRepository.dataFromToken(token);

        if (tokenValue) {
          next();
          return;
        }
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    }

    return res.status(401).json({ message: 'User is not logged in' });
  }
}
