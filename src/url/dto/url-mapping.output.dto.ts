import { Expose } from 'class-transformer';

export class UrlMappingOutputDto {
  @Expose()
  shortUrl: string;

  @Expose()
  longUrl: string;

  @Expose()
  creationDate: Date;

  @Expose()
  expirationDate: Date;
}
