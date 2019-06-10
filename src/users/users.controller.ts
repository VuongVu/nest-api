import { Controller, Body, Post, Get, Res } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userDto: CreateUserDto) {
    await this.usersService.create(userDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
