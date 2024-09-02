import { Module } from '@nestjs/common';
import { UrlRedirectController } from 'apps/url-shortener/src/url-redirect/url-redirect-controller';
import { UrlModule } from 'apps/url-shortener/src/url/url.module';

@Module({
  imports: [UrlModule],
  controllers: [UrlRedirectController],
})
export class UrlRedirectModule {}
