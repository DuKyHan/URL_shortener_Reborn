import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as base62 from 'base62';
import { plainToClass } from 'class-transformer';
import * as md5 from 'md5';
import { Model } from 'mongoose';
import urlConfig from 'src/config/url.config';
import { ShortenUrlInputDto } from 'src/url/dto/shorten-url.input.dto';
import { UrlMappingOutputDto } from 'src/url/dto/url-mapping.output.dto';
import { UrlMapping } from 'src/url/schema/url-mapping.schema';
import { UserAccessTokenClaims } from 'src/user/dto/claim.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(UrlMapping.name)
    private readonly urlMappingModel: Model<UrlMapping>,
    @Inject(urlConfig.KEY)
    private readonly urlConfigApi: ConfigType<typeof urlConfig>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async shortenUrl(user: UserAccessTokenClaims, dto: ShortenUrlInputDto) {
    const exist = await this.urlMappingModel.findOne({ longUrl: dto.url });
    if (exist && (dto.expirationInSeconds || dto.alias)) {
      if (dto.expirationInSeconds) {
        exist.expirationDate = new Date(
          Date.now() + dto.expirationInSeconds * 1000,
        );
      }
      if (dto.alias) {
        const existing = await this.urlMappingModel.findOne({
          shortUrl: `${this.urlConfigApi.domain}/${dto.alias}`,
        });
        if (existing && existing.longUrl !== dto.url) {
          throw new BadRequestException('Alias already exists');
        }
        exist.shortUrl = `${this.urlConfigApi.domain}/${dto.alias}`;
      }
      await exist.save();
      return plainToClass(UrlMappingOutputDto, exist, {
        excludeExtraneousValues: true,
      });
    }
    if (exist) {
      return plainToClass(UrlMappingOutputDto, exist, {
        excludeExtraneousValues: true,
      });
    }

    if (dto.alias) {
      const existing = await this.urlMappingModel.findOne({
        shortUrl: `${this.urlConfigApi.domain}/${dto.alias}`,
      });
      if (existing) {
        throw new BadRequestException('Alias already exists');
      }
      const res = await this.urlMappingModel.create({
        shortUrl: `${this.urlConfigApi.domain}/${dto.alias}`,
        longUrl: dto.url,
        expirationDate: dto.expirationInSeconds
          ? Date.now() + dto.expirationInSeconds * 1000
          : Date.now() + this.urlConfigApi.expirationTimeInSeconds * 1000,
        user: user,
      });
      return plainToClass(UrlMappingOutputDto, res, {
        excludeExtraneousValues: true,
      });
    }

    for (let i = 0; i < 26; i++) {
      const hash = this.hashUrl(dto.url, i);
      const url = `${this.urlConfigApi.domain}/${hash}`;
      const existing = await this.urlMappingModel.findOne({ shortUrl: url });
      if (existing) {
        continue;
      }
      const res = await this.urlMappingModel.create({
        shortUrl: url,
        longUrl: dto.url,
        expirationDate: dto.expirationInSeconds
          ? Date.now() + dto.expirationInSeconds * 1000
          : Date.now() + this.urlConfigApi.expirationTimeInSeconds * 1000,

        user: user,
      });
      return plainToClass(UrlMappingOutputDto, res, {
        excludeExtraneousValues: true,
      });
    }
    throw new InternalServerErrorException('Failed to generate a short URL');
  }

  async getLongUrl(shortUrlHash: string) {
    const url = `${this.urlConfigApi.domain}/${shortUrlHash}`;
    const cached = (await this.cacheManager.get(url)) as string;
    if (cached) {
      return cached;
    }
    const res = await this.urlMappingModel.findOne({ shortUrl: url });
    if (!res) {
      throw new NotFoundException('URL not found');
    }
    if (res.expirationDate < new Date()) {
      throw new BadRequestException('URL expired');
    }
    await this.cacheManager.set(
      url,
      res.longUrl,
      Math.min(
        res.expirationDate.getTime() - Date.now(),
        this.urlConfigApi.cacheExpirationTimeInSeconds * 1000,
      ),
    );
    return res.longUrl;
  }

  private hashUrl(url: string, position: number) {
    const hash = md5(url);
    const bytes = hash.slice(position, 12 + position);
    const decimal = parseInt(bytes, 16);
    return base62.encode(decimal);
  }
}
