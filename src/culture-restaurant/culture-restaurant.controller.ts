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
import { RestaurantDto } from 'src/restaurant/restaurant.dto';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CultureRestaurantService } from './culture-restaurant.service';

@Controller('cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class CultureRestaurantController {
  constructor(
    private readonly cultureRestaurantService: CultureRestaurantService,
  ) {}

  @Post(':cultureId/restaurants/:restaurantId')
  async addRestaurantToCulture(
    @Param('cultureId') cultureId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.cultureRestaurantService.addRestaurantToCulture(
      cultureId,
      restaurantId,
    );
  }

  @Get(':cultureId/restaurants/:restarantId')
  async findRestaurantByCultureIdAndRestaurantId(
    @Param('cultureId') cultureId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.cultureRestaurantService.findRestaurantByCultureIdAndRestaurantId(
      cultureId,
      restaurantId,
    );
  }

  @Get(':cultureId/restaurants')
  async findRestaurantsByCulture(@Param('cultureId') cultureId: string) {
    return await this.cultureRestaurantService.findRestaurantsByCultureId(
      cultureId,
    );
  }

  @Put(':cultureId/restaurants')
  async associateRestaurantsToCulture(
    @Param('cultureId') cultureId: string,
    @Body() restaurantDto: RestaurantDto[],
  ) {
    const restaurants = plainToInstance(RestaurantEntity, restaurantDto);
    return await this.cultureRestaurantService.associateRestaurantsToCulture(
      cultureId,
      restaurants,
    );
  }

  @Delete(':cultureId/restaurants/:restaurantId')
  @HttpCode(204)
  async deleteRestaurantOfACulture(
    @Param('cultureId') cultureId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    await this.cultureRestaurantService.deleteRestaurantFromCulture(
      cultureId,
      restaurantId,
    );
  }
}
