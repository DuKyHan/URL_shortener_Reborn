import { IsUrl } from 'class-validator';

export class ShortenUrlInputDto {
  @IsUrl()
  url: string;
}
