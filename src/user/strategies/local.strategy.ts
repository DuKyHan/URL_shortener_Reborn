import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { STRATEGY_LOCAL } from 'src/user/constants';
import { UserAccessTokenClaims } from 'src/user/dto/claim.dto';
import { UserService } from 'src/user/user.service';

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
