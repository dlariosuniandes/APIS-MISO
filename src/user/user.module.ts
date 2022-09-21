import { Module, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, AuthService, JwtService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule implements OnModuleInit {
  constructor(private userService: UserService) {}
  async onModuleInit() {
    await this.userService.onModuleInit();
  }
}
