import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import authConfig from 'apps/url-shortener/src/config/auth.config';
import databaseConfig from 'apps/url-shortener/src/config/database.config';
import redisConfig from 'apps/url-shortener/src/config/redis.config';
import throttleConfig from 'apps/url-shortener/src/config/throttle.config';
import urlConfig from 'apps/url-shortener/src/config/url.config';
import { UrlRedirectModule } from 'apps/url-shortener/src/url-redirect/url-redirect.module';
import { UrlModule } from 'apps/url-shortener/src/url/url.module';
import { JwtAuthGuard } from 'apps/url-shortener/src/user/guard/jwt-auth.guard';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';
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
      load: [
        authConfig,
        databaseConfig,
        redisConfig,
        urlConfig,
        throttleConfig,
      ],
      isGlobal: true,
      cache: true,
    }),
    ThrottlerModule.forRootAsync({
      inject: [throttleConfig.KEY, redisConfig.KEY],
      useFactory: (
        throttleConfigApi: ConfigType<typeof throttleConfig>,
        redisConfigApi: ConfigType<typeof redisConfig>,
      ) => ({
        throttlers: [
          {
            ttl: throttleConfigApi.ttlInMilliseconds,
            limit: throttleConfigApi.limit,
          },
        ],
        storage: new ThrottlerStorageRedisService({
          host: redisConfigApi.host,
          port: redisConfigApi.port,
          password: redisConfigApi.password,
        }),
      }),
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
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
