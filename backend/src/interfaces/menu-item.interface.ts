import { Document } from 'mongoose';

export interface MenuItem extends Document {
  readonly name: string;
  readonly price: number;
  readonly restaurant: string; // Restaurant ID
}
