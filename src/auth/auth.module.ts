import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../shared/auth/jwtconstants';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { LocalStrategy } from './local-strategy/local-strategy';

@Module({
  providers: [AuthService, JwtService, LocalStrategy],
  controllers: [AuthController],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register(jwtConstants),
  ],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
