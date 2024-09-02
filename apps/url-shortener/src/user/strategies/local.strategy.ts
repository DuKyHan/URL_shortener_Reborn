import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { STRATEGY_LOCAL } from 'apps/url-shortener/src/user/constants';
import { UserAccessTokenClaims } from 'apps/url-shortener/src/user/dto/claim.dto';
import { UserService } from 'apps/url-shortener/src/user/user.service';
import { Request } from 'express';
import { Strategy } from 'passport-local';

/**
 * Use to provide strategy for local auth guard
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, STRATEGY_LOCAL) {
  constructor(private authService: UserService) {
    // Add option passReqToCallback: true to configure strategy to be request-scoped.
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    email: string,
    password: string,
  ): Promise<UserAccessTokenClaims> {
    const account = await this.authService.validateUser({ email, password });
    return account;
  }
}
