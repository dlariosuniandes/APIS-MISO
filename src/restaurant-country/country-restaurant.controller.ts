import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-strategy/jwt-auth.guard';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CountryRestaurantService } from './country-restaurant.service';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class CountryRestaurantController {
  constructor(
    private readonly countryRestaurantService: CountryRestaurantService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':restaurantId/countries/:countryId')
  async addCountryToRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('countryId') countryId: string,
  ) {
    return await this.countryRestaurantService.addCountryToRestaurant(
      countryId,
      restaurantId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':restaurantId/countries/:countryId')
  @HttpCode(204)
  async deleteCountryOfACulture(
    @Param('restaurantId') restaurantId: string,
    @Param('countryId') countryId: string,
  ) {
    await this.countryRestaurantService.deleteCountryFromRestaurant(
      countryId,
      restaurantId,
    );
  }
}
