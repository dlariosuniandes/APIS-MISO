import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/shared/auth/jwtconstants';
import { RoleEnum } from 'src/enums/role.enum';

export type Token = {
  sub: string;
  username: string;
  role: string;
};
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string): Promise<object> {
    const storedUser = await this.userService.findOne(userName);
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
    const userRetrieved = await this.usersService.findOne(user.userName);
    const payload: Token = {
      username: user.username,
      sub: user.id,
      role: userRetrieved.role,
    };
    return {
      token: this.jwtService.sign(payload, {
        privateKey: jwtConstants.secret,
      }),
    };
  }
}
