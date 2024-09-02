import { IsInt, IsOptional, IsUrl, Matches, Max } from 'class-validator';

export class ShortenUrlInputDto {
  @IsUrl()
  url: string;

  // 30 days max expiration
  @IsOptional()
  @Max(2592000)
  @IsInt()
  expirationInSeconds?: number;

  @IsOptional()
  @Matches(/[a-zA-Z0-9_-]{6,20}/, {
    message:
      'Alias must be between 6 and 20 characters, contains only characters, numbers, - and _',
  })
  alias?: string;
}
