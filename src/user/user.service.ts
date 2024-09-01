import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, hashSync } from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import authConfig from 'src/config/auth.config';
import { UserAccessTokenClaims } from 'src/user/dto/claim.dto';
import { LoginDto } from 'src/user/dto/login.dto';
import { TokenOutputDto } from 'src/user/dto/token-output.dto';
import { UserOutputDto } from 'src/user/dto/user.output.dto';
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

  async register(dto: RegisterUserDto) {
    const exist = await this.userModel.findOne({ email: dto.email });
    if (exist) {
      throw new BadRequestException('Email already exists');
    }

    const res = await this.userModel.create({
      email: dto.email,
      password: hashSync(dto.password, 10),
      name: dto.name,
    });
    return plainToClass(UserOutputDto, res, { excludeExtraneousValues: true });
  }

  async validateUser(input: LoginDto): Promise<UserAccessTokenClaims> {
    console.log('input', input);
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

  async login(dto: UserAccessTokenClaims): Promise<TokenOutputDto> {
    return this.getAuthToken(dto);
  }

  getAuthToken(account: UserAccessTokenClaims): TokenOutputDto {
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
