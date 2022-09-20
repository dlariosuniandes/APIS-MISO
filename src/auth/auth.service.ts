import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/shared/auth/jwtconstants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string): Promise<object> {
    const storedUser = await this.usersService.findOne(userName);
    if (storedUser) {
      if (bcrypt.compareSync(password, storedUser.password)) {
        const { password, ...rest } = storedUser.obtainUser();
        return rest;
      } else {
        throw new UnauthorizedException('Username or password is wrong');
      }
    } else {
      throw new UnauthorizedException('Username or password is wrong');
    }
  }

  async login(user: any) {
    const payload = { name: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload, {
        privateKey: jwtConstants.secret,
      }),
    };
  }
}
