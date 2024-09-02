import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UrlMapping,
  UrlMappingSchema,
} from 'apps/url-shortener/src/url/schema/url-mapping.schema';
import { UrlController } from 'apps/url-shortener/src/url/url.controller';
import { UrlService } from 'apps/url-shortener/src/url/url.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UrlMapping.name,
        schema: UrlMappingSchema,
      },
    ]),
  ],
  controllers: [UrlController],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
