import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    // This route does not need authentication, so no guard needed
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    // Apply the JwtAuthGuard to protect the findAll route
    @UseGuards(JwtAuthGuard) // Protect this route with JWT authentication
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }
}
