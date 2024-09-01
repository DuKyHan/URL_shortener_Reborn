import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

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
