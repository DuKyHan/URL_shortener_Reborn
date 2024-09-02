import { Expose } from 'class-transformer';

export class UserOutputDto {
  @Expose()
  email: string;

  @Expose()
  name: string;
}
