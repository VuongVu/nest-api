import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserLoginDto } from '../users/dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() userLoginDto: UserLoginDto, @Res() res: Response) {
    // find user exists in db
    const user: User = await this.usersService.findByEmail(userLoginDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // compare password input & db
    const checkPassword = bcrypt.compareSync(
      userLoginDto.password,
      user.password,
    );
    if (!checkPassword) {
      throw new BadRequestException('Password does not match');
    }

    // create accessToken
    const token = await this.authService.createToken(
      user.id.toString(),
      user.email,
    );
    res.status(HttpStatus.OK).json({
      email: user.email,
      token,
    });
  }

  @Post('/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() user: User, @Res() res: Response) {
    const isUserExists = await this.usersService.findByEmail(user.email);
    if (isUserExists) {
      throw new BadRequestException('Email is exists, please try another');
    }

    const newUser = await this.usersService.create(user);
    const token = await this.authService.createToken(
      newUser.id.toString(),
      newUser.email,
    );

    res.status(HttpStatus.OK).json({
      email: user.email,
      token,
    });
  }
}
