import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UrlMapping,
  UrlMappingSchema,
} from 'src/url/schema/url-mapping.schema';
import { UrlController } from 'src/url/url.controller';
import { UrlService } from 'src/url/url.service';

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
})
export class UrlModule {}
