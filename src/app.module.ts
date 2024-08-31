import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import authConfig from 'src/config/auth.config';
import { UrlModule } from 'src/url/url.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://hquan310:gnLxDSlbieU6TDAR@cluster0.o0u8o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UserModule,
    UrlModule,
    ConfigModule.forRoot({
      load: [authConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //{ provide: APP_GUARD, useClass: JwtAuthGuard }
  ],
})
export class AppModule {}
