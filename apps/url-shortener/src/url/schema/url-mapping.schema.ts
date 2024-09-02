import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'apps/url-shortener/src/user/schema/user.schema';
import { now } from 'mongoose';

@Schema()
export class UrlMapping {
  @Prop()
  shortUrl: string;

  @Prop()
  longUrl: string;

  @Prop({ default: now })
  creationDate: Date;

  @Prop({ expires: 0 })
  expirationDate: Date;

  @Prop()
  user: User;
}

export const UrlMappingSchema = SchemaFactory.createForClass(UrlMapping);
