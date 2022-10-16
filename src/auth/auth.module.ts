import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './strategies/local-strategy';
import { UserEntity } from 'src/user/user.entity';
import jwtConstants from 'src/shared/security/constants';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  providers: [AuthService, JwtService, LocalStrategy, JwtStrategy],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.JWT_SECRET,
      signOptions: { expiresIn: jwtConstants.JWT_EXPIRES_IN },
    }),
  ],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
