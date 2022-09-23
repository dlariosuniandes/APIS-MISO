import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import jwtConstants from '../shared/security/constants';
import { UserEntity } from '../user/user.entity';

export type Token = {
  sub: string;
  username: string;
  role: string;
  resources: string[] | undefined;
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
    const userRetrieved: UserEntity = await this.userService.findOne(
      user.username,
    );
    const payload: Token = {
      username: userRetrieved.userName,
      sub: userRetrieved.id,
      role: userRetrieved.role,
      resources: userRetrieved.resources,
    };
    return {
      token: this.jwtService.sign(payload, {
        secret: jwtConstants.JWT_SECRET,
        expiresIn: jwtConstants.JWT_EXPIRES_IN,
      }),
    };
  }
}
