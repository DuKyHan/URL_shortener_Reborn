import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'apps/url-shortener/src/user/guard/jwt-auth.guard';
import { JwtRefreshGuard } from 'apps/url-shortener/src/user/guard/jwt-refresh.guard';
import { LocalAuthGuard } from 'apps/url-shortener/src/user/guard/local-auth.guard';
import {
  User,
  UserSchema,
} from 'apps/url-shortener/src/user/schema/user.schema';
import {
  JwtAuthStrategy,
  JwtRefreshStrategy,
  LocalStrategy,
} from 'apps/url-shortener/src/user/strategies';
import * as a from 'mongoose-unique-validator';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(a, { message: 'Required unique fields' });
          return schema;
        },
      },
    ]),
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
