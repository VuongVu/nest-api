import {
  Controller,
  Body,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() user: User) {
    await this.usersService.create(user);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }
}
