import { registerAs } from '@nestjs/config';

export default registerAs('url', () => ({
  domain: process.env.URL_DOMAIN,
  expirationTimeInSeconds: parseInt(
    process.env.URL_EXPIRATION_TIME_IN_SECONDS || '3600',
  ),
  cacheExpirationTimeInSeconds: parseInt(
    process.env.URL_CACHE_EXPIRATION_TIME_IN_SECONDS || '30',
  ),
}));
