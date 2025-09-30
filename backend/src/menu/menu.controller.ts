import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FirebaseService } from '../firebase/firebase.service';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createMenuItemDto: CreateMenuItemDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createMenuItemDto.imageUrl = await this.firebaseService.uploadImage(file);
    }
    return this.menuService.create(createMenuItemDto);
  }

  @Get('restaurant/:restaurantId')
  findAll(@Param('restaurantId') restaurantId: string) {
    return this.menuService.findAll(restaurantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const menuItem = await this.menuService.findOne(id);
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID "${id}" not found`);
    }
    return menuItem;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateMenuItemDto.imageUrl = await this.firebaseService.uploadImage(file);
    }
    return this.menuService.update(id, updateMenuItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const menuItem = await this.menuService.remove(id);
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID "${id}" not found`);
    }
    return menuItem;
  }
}