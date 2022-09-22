import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/shared/auth/jwtconstants';
import { UserEntity } from '../users/user.entity';

export type Token = {
  sub: string;
  username: string;
  role: string;
};
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
    const userRetrieved = await this.usersService.findOne(user.username);
    const payload: Token = {
      username: userRetrieved.userName,
      sub: userRetrieved.id,
      role: userRetrieved.role,
    };
    return {
      token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.signOptions.expiresIn,
      }),
    };
  }

  async validateRole(
    token: string | undefined,
    role: string,
  ): Promise<boolean> {
    try {
      const tokenPayload = this.jwtService.verify(token, {});
      const storedUser: UserEntity = await this.usersService.findOne(
        tokenPayload.username,
      );
      return storedUser.role === role && storedUser.role === tokenPayload.role;
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
