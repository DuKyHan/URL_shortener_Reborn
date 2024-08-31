import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as base62 from 'base62';
import * as md5 from 'md5';
import { Model } from 'mongoose';
import { ShortenUrlInputDto } from 'src/url/dto/shorten-url.input.dto';
import { UrlMapping } from 'src/url/schema/url-mapping.schema';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(UrlMapping.name)
    private readonly urlMappingModel: Model<UrlMapping>,
  ) {}

  async shortenUrl(dto: ShortenUrlInputDto) {
    const hash = this.hashUrl(dto.url, 0);
    const url = `http://localhost:3000/${hash}`;
    this.urlMappingModel.findOne({ shortUrl: url });
    return hash;
  }

  private hashUrl(url: string, position: number) {
    const hash = md5(url);
    const bytes = hash.slice(position, 12 + position);
    const decimal = parseInt(bytes, 16);
    return base62.encode(decimal);
  }
}
