import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User | null;
    }
  }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}
  async use(req: Request, res: Response, next: (error?: NextFunction) => void) {
    const { userId } = req.session || {};
    if (userId) {
      const foundedUser = await this.userService.findOne(+userId);
      req.currentUser = foundedUser;
    }
    next();
  }
}
