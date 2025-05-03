import {
    Controller,
    Post,
    Body,
    Res,
    Get,
    Req,
    HttpCode,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RequestWithCookies } from '../types/express';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(loginDto, res);
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        const result = await this.authService.forgotPassword(forgotPasswordDto);
        if (!result.success) {
            throw new UnauthorizedException(result.message);
        }
        return result;
    }

    @Post('reset-password')
    async resetPassword(@Body() body: { token: string; newPassword: string }) {
        return this.authService.resetPassword(body.token, body.newPassword);
    }

    @Get('check-auth')
    @HttpCode(200)
    async checkAuth(@Req() req: RequestWithCookies) {
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new UnauthorizedException('No token found');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                id: string;
                userName: string;
                email: string;
                role: 'admin' | 'user';
            };

            return {
                user: {
                    id: decoded.id,
                    userName: decoded.userName,
                    email: decoded.email,
                    role: decoded.role,
                },
                success: true,
                message: 'User authenticated',
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
