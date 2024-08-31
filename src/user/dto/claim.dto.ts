import { Expose } from 'class-transformer';

export class AccountAccessTokenClaims {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
