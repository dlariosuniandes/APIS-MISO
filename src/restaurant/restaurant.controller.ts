import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-strategy/jwt-auth.guard';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { RestaurantDto } from './restaurant.dto';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.restaurantService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':restaurantId')
  async findOne(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantService.findOne(restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() restaurantDto: RestaurantDto) {
    const restaurant: RestaurantEntity = plainToInstance(
      RestaurantEntity,
      restaurantDto,
    );
    return await this.restaurantService.create(restaurant);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':restaurantId')
  async update(
    @Param('restaurantId') restaurantId: string,
    @Body() restaurantDto: RestaurantDto,
  ) {
    const restaurant: RestaurantEntity = plainToInstance(
      RestaurantEntity,
      restaurantDto,
    );
    return await this.restaurantService.update(restaurantId, restaurant);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':restaurantId')
  @HttpCode(204)
  async delete(@Param('restaurantId') restaurantId: string) {
    await this.restaurantService.delete(restaurantId);
  }
}
