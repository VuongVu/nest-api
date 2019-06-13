import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UserLoginDto } from '../users/dto/user-login.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() userLoginDto: UserLoginDto, @Res() res: Response) {
    const user: User = await this.usersService.findByEmail(userLoginDto.email);
    if (!user) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'User not found' });
    }

    const checkPassword = bcrypt.compareSync(
      userLoginDto.password,
      user.password,
    );
    if (!checkPassword) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Password does not match' });
    }

    const token = await this.authService.createToken(userLoginDto.email);
    res.status(HttpStatus.OK).json({
      email: userLoginDto.email,
      token,
    });
  }
}
