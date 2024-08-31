import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync } from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import authConfig from 'src/config/auth.config';
import { AccountAccessTokenClaims } from 'src/user/dto/claim.dto';
import { LoginDto } from 'src/user/dto/login.dto';
import { TokenOutputDto } from 'src/user/dto/token-output.dto';
import { User } from 'src/user/schema/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  private accessTokenExpirationTime: number;
  private refreshTokenExpirationTime: number;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(authConfig.KEY)
    private configService: ConfigType<typeof authConfig>,
    private jwtService: JwtService,
  ) {
    this.accessTokenExpirationTime = this.configService.accessTokenLifeSec;
    this.refreshTokenExpirationTime = this.configService.refreshTokenLifeSec;
  }

  async register(user: RegisterUserDto) {
    return user;
  }

  async validateUser(input: LoginDto): Promise<AccountAccessTokenClaims> {
    const res = await this.userModel.findOne({ email: input.email });
    if (!res) {
      throw new NotFoundException('User not found');
    }
    if (!compareSync(input.password, res.password)) {
      throw new NotFoundException('User not found');
    }
    return {
      id: 1,
      email: input.email,
    };
  }

  getAuthToken(account: AccountAccessTokenClaims): TokenOutputDto {
    const subject = { sub: account.id };
    const payload = {
      email: account.email,
      sub: account.id,
    };

    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.refreshTokenExpirationTime,
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        { expiresIn: this.accessTokenExpirationTime },
      ),
    };
    return plainToClass(TokenOutputDto, authToken, {
      excludeExtraneousValues: true,
    });
  }

  async refreshToken(accountId: number): Promise<TokenOutputDto> {
    const account = await this.userModel.findById(accountId);
    if (!account) {
      throw new UnauthorizedException('Invalid user id');
    }

    return plainToInstance(
      TokenOutputDto,
      this.getAuthToken({ id: account.id, email: account.email }),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
