// src/middleware/jwt-auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Match your actual import path

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return next();
            }

            const token = authHeader.split(' ')[1];

            const decoded = this.jwtService.verify(token);

            if (decoded && decoded.email) {
                // Fetch the user from database to get the latest role information
                const user = await this.usersService.findByEmail(decoded.email);

                if (user) {
                    // Attach user object to request
                    req['user'] = {
                        userId: user._id,
                        email: user.email,
                        userName: user.userName,
                        role: user.role
                    };
                }
            }

            next();
        } catch (error) {
            console.error('JWT authentication error:', error.message);
            // Just proceed without setting user (will be caught by guards if auth is required)
            next();
        }
    }
}