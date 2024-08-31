import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/user/guard/jwt-auth.guard';
import { JwtRefreshGuard } from 'src/user/guard/jwt-refresh.guard';
import { LocalAuthGuard } from 'src/user/guard/local-auth.guard';
import { User, UserSchema } from 'src/user/schema/user.schema';
import {
  JwtAuthStrategy,
  JwtRefreshStrategy,
  LocalStrategy,
} from 'src/user/strategies';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtAuthGuard,
    JwtRefreshGuard,
    LocalAuthGuard,
    LocalStrategy,
    JwtAuthStrategy,
    JwtRefreshStrategy,
  ],
})
export class UserModule {}
