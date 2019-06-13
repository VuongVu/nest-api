import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JWT_EXPIRES } from '../configs/vars';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async createToken(id: string, email: string) {
    const payload: JwtPayload = { id, email };
    const accessToken = this.jwtService.sign(payload);

    return {
      expiresIn: JWT_EXPIRES,
      accessToken,
    };
  }

  async validate(payload: JwtPayload): Promise<any> {
    return await this.usersService.findById(payload.id);
  }
}
