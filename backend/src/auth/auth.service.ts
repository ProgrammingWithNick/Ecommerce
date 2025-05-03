import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { Response } from 'express';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt-payload.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

interface RequestWithCookies extends Request {
    cookies: {
        accessToken?: string;
        [key: string]: any;
    };
}

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

    async register(registerDto: RegisterDto) {
        const { userName, email, password } = registerDto;

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            return { success: false, message: 'User already exists!' };
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new this.userModel({ userName, email, password: hashedPassword });
        await newUser.save();

        return { success: true, message: 'Registration successful' };
    }

    async validateUser(email: string, password: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ email });
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    }

    async login(loginDto: LoginDto, res: Response) {
        const { email, password } = loginDto;

        const user = await this.validateUser(email, password);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const id = user._id?.toString();
        if (!id) throw new UnauthorizedException('User ID not found');

        const payload: JwtPayload = {
            id,
            email: user.email,
            role: user.role,
            userName: user.userName,
        };

        const jwtSecret = process.env.JWT_SECRET!;
        const token = jwt.sign(payload, jwtSecret, {
            expiresIn: process.env.JWT_EXPIRATION || '1d',
        });

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24,
        });

        return {
            success: true,
            message: 'Login successful',
            user: {
                id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            },
        };
    }

    async logout(res: Response) {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return { success: true, message: 'Logged out successfully!' };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userModel.findOne({ email });

        if (!user) {
            return {
                success: false,
                message: 'No account found with that email address.',
            };
        }

        const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        try {
            await this.sendResetPasswordEmail(user.email, resetToken);
            return {
                success: true,
                message: 'Password reset email sent.',
            };
        } catch (error) {
            console.error('Error sending email:', error);
            return {
                success: false,
                message: 'Failed to send password reset email.',
            };
        }
    }

    private async sendResetPasswordEmail(email: string, resetToken: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>We received a request to reset your password.</p>
                <p><a href="${resetUrl}" target="_blank">Click here to reset your password</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn’t request this, please ignore this email.</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent:', info.response);
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
            const user = await this.userModel.findOne({ email: payload.email });

            if (!user) throw new UnauthorizedException('Invalid token or user does not exist');

            user.password = await bcrypt.hash(newPassword, 12);
            await user.save();

            return {
                success: true,
                message: 'Password has been reset successfully',
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    async checkAuth(req: RequestWithCookies) {
        const token = req.cookies?.accessToken;

        if (!token) {
            return {
                success: false,
                user: null,
                message: 'No token found',
            };
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
            return {
                success: false,
                user: null,
                message: 'Invalid or expired token',
            };
        }
    }
}
