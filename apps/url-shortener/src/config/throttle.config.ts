import { registerAs } from '@nestjs/config';

export default registerAs('throttle', () => ({
  limit: process.env.THROTTLE_LIMIT ? parseInt(process.env.THROTTLE_LIMIT) : 10,
  ttlInMilliseconds: process.env.THROTTLE_TTL_IN_MILLISECONDS
    ? parseInt(process.env.THROTTLE_TTL_IN_MILLISECONDS)
    : 60000,
}));
