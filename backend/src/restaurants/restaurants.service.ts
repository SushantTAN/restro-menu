import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from '../schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const createdRestaurant = new this.restaurantModel(createRestaurantDto);
    return createdRestaurant.save();
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.find().lean().exec();
  }

  async findOne(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findById(id).lean().exec();
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant | null> {
    return this.restaurantModel.findByIdAndUpdate(id, updateRestaurantDto, { new: true }).lean().exec();
  }

  async remove(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findByIdAndDelete(id).lean().exec();
  }
}