import { Document } from 'mongoose';

export interface Restaurant extends Document {
  readonly name: string;
  readonly address: string;
}
