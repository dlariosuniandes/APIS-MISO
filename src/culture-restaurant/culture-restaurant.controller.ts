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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RestaurantDto } from 'src/restaurant/restaurant.dto';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CultureRestaurantService } from './culture-restaurant.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Cultures - Restaurants')
@ApiBearerAuth()
@Controller('cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class CultureRestaurantController {
  constructor(
    private readonly cultureRestaurantService: CultureRestaurantService,
  ) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get(':cultureId/restaurants')
  async findRestaurantsByCulture(@Param('cultureId') cultureId: string) {
    return await this.cultureRestaurantService.findRestaurantsByCultureId(
      cultureId,
    );
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
