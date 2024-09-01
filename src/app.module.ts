import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';
import authConfig from 'src/config/auth.config';
import databaseConfig from 'src/config/database.config';
import redisConfig from 'src/config/redis.config';
import urlConfig from 'src/config/url.config';
import { UrlRedirectModule } from 'src/url-redirect/url-redirect.module';
import { UrlModule } from 'src/url/url.module';
import { JwtAuthGuard } from 'src/user/guard/jwt-auth.guard';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: (redisConfigApi: ConfigType<typeof redisConfig>) => ({
        store: redisStore,
        socket: {
          host: redisConfigApi.host,
          port: redisConfigApi.port,
        },
        password: redisConfigApi.password,
      }),
      inject: [redisConfig.KEY],
    }),
    MongooseModule.forRootAsync({
      useFactory: (databaseConfigApi: ConfigType<typeof databaseConfig>) => ({
        uri: databaseConfigApi.url,
      }),
      inject: [databaseConfig.KEY],
    }),
    UserModule,
    UrlModule,
    UrlRedirectModule,
    ConfigModule.forRoot({
      load: [authConfig, databaseConfig, redisConfig, urlConfig],
      isGlobal: true,
      cache: true,
    }),
    RouterModule.register([
      {
        path: '',
        module: UrlRedirectModule,
        children: [
          {
            path: 'api/v1',
            children: [UserModule, UrlModule],
          },
        ],
      },
    ]),
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
