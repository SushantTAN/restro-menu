import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Restaurant } from './restaurant.schema';

export type MenuItemDocument = MenuItem & Document;

@Schema()
export class MenuItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Restaurant;

  @Prop()
  description?: string;

  @Prop()
  imageUrl?: string;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);