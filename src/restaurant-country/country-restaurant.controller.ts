import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CountryRestaurantService } from './country-restaurant.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/authorization/role.decorator';

@ApiTags('Countries - Restaurants')
@ApiBearerAuth()
@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class CountryRestaurantController {
  constructor(
    private readonly countryRestaurantService: CountryRestaurantService,
  ) {}

  @Roles(Role.ALLOW_CREATE)
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

  @Roles(Role.ALLOW_DELETE)
  @Delete(':restaurantId/countries/:countryId')
  @HttpCode(204)
  async deleteCountryOfARestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('countryId') countryId: string,
  ) {
    await this.countryRestaurantService.deleteCountryFromRestaurant(
      countryId,
      restaurantId,
    );
  }
}
