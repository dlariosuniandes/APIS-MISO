import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserDto } from './user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authorization/public.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Body() userDto: UserDto) {
    return this.authService.login(userDto);
  }
}
