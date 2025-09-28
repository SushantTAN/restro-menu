import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from '../schemas/menu-item.schema';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    const createdMenuItem = new this.menuItemModel(createMenuItemDto);
    return createdMenuItem.save();
  }

  async findAll(restaurantId: string): Promise<MenuItem[]> {
    return this.menuItemModel.find({ restaurant: restaurantId }).lean().exec();
  }

  async findOne(id: string): Promise<MenuItem | null> {
    return this.menuItemModel.findById(id).lean().exec();
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem | null> {
    return this.menuItemModel.findByIdAndUpdate(id, updateMenuItemDto, { new: true }).lean().exec();
  }

  async remove(id: string): Promise<MenuItem | null> {
    return this.menuItemModel.findByIdAndDelete(id).lean().exec();
  }
}