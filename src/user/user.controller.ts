import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ReqContext, RequestContext } from 'src/common/request-context';
import { Public } from 'src/user/decorators';
import { RefreshTokenInputDto } from 'src/user/dto/refresh-token.dto';
import { JwtRefreshGuard } from 'src/user/guard/jwt-refresh.guard';
import { LocalAuthGuard } from 'src/user/guard/local-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@ReqContext() context: RequestContext) {
    return this.userService.login(context.user);
  }

  @Public()
  @Post('register')
  async register(@Body() user: RegisterUserDto) {
    return await this.userService.register(user);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Body() input: RefreshTokenInputDto) {
    // return this.userService.refreshToken(req.user['sub']);
  }
}
