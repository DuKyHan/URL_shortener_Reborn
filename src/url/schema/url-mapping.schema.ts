import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class UrlMapping {
  @Prop()
  shortUrl: string;

  @Prop()
  longUrl: string;

  @Prop()
  creationDate: Date;

  @Prop()
  expirationDate: Date;

  @Prop()
  user: User;
}

export const UrlMappingSchema = SchemaFactory.createForClass(UrlMapping);
