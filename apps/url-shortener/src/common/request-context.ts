import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAccessTokenClaims } from 'apps/url-shortener/src/user/dto/claim.dto';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';

export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';

export class RequestContext {
  public requestId: string;

  public url: string;

  public ip: string;

  public user: UserAccessTokenClaims;
}

export function createRequestContext(request: Request): RequestContext {
  const ctx = new RequestContext();
  ctx.requestId = request.header(REQUEST_ID_TOKEN_HEADER) || '';
  ctx.url = request.url;
  const ip = request.header(FORWARDED_FOR_TOKEN_HEADER);
  ctx.ip = ip ? ip : request.ip;

  // If request.user does not exist, we explicitly set it to null.
  ctx.user = request.user
    ? plainToClass(UserAccessTokenClaims, request.user, {
        excludeExtraneousValues: true,
      })
    : new UserAccessTokenClaims();

  return ctx;
}

export const ReqContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    switch (ctx.getType()) {
      case 'http':
        const request = ctx.switchToHttp().getRequest();
        return createRequestContext(request);
      default:
        throw new Error('Unsupported context type');
    }
  },
);
