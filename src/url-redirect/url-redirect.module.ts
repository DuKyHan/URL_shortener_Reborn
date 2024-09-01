import { Module } from '@nestjs/common';
import { UrlRedirectController } from 'src/url-redirect/url-redirect-controller';
import { UrlModule } from 'src/url/url.module';

@Module({
  imports: [UrlModule],
  controllers: [UrlRedirectController],
})
export class UrlRedirectModule {}
