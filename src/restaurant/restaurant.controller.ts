import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { RestaurantDto } from './restaurant.dto';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/authorization/role.decorator';

@ApiTags('Restaurants')
@ApiBearerAuth()
@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Roles(Role.READ_ONLY)
  @Get()
  async findAll() {
    return await this.restaurantService.findAll();
  }

  @Roles(Role.READ_ONLY)
  @Get(':restaurantId')
  async findOne(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantService.findOne(restaurantId);
  }

  @Roles(Role.ALLOW_CREATE)
  @Post()
  async create(@Body() restaurantDto: RestaurantDto) {
    const restaurant: RestaurantEntity = plainToInstance(
      RestaurantEntity,
      restaurantDto,
    );
    return await this.restaurantService.create(restaurant);
  }

  @Roles(Role.ALLOW_MODIFY)
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

  @Roles(Role.ALLOW_DELETE)
  @Delete(':restaurantId')
  @HttpCode(204)
  async delete(@Param('restaurantId') restaurantId: string) {
    await this.restaurantService.delete(restaurantId);
  }
}
