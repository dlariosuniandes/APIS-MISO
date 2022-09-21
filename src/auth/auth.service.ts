import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import jwtConstants from 'src/shared/security/constants';

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
    console.log(user.user);
    const userRetrieved = await this.userService.findOne(user.user.userName);
    const payload: Token = {
      username: userRetrieved.userName,
      sub: userRetrieved.id,
      role: userRetrieved.role,
    };
    console.log(payload);
    return {
      token: this.jwtService.sign(payload, {
        privateKey: jwtConstants.JWT_SECRET,
      }),
    };
  }
}
