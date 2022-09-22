import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from '../shared/auth/auth.guard';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../users/user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req, @Body() user: UserDto) {
    return this.authService.login(user);
  }
}
