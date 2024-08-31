import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from 'src/user/dto/login.dto';
import { RefreshTokenInputDto } from 'src/user/dto/refresh-token.dto';
import { JwtRefreshGuard } from 'src/user/guard/jwt-refresh.guard';
import { LocalAuthGuard } from 'src/user/guard/local-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user: LoginDto) {}

  @Post('register')
  async register(@Body() user: RegisterUserDto) {
    return await this.userService.register(user);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Body() input: RefreshTokenInputDto) {
    // return this.userService.refreshToken(req.user['sub']);
  }
}
