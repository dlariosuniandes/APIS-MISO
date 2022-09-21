import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/shared/auth/auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req);
  }
}
