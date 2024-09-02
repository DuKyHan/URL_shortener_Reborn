import { Expose } from 'class-transformer';

export class ShortenUrlOutputDto {
  @Expose()
  url: string;

  @Expose()
  shortUrl: string;
}
