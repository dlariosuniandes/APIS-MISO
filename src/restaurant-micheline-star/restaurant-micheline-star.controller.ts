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
import { MichelineStarDto } from '../micheline-star/micheline-star.dto';
import { MichelineStarEntity } from '../micheline-star/micheline-star.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestaurantMichelineStarService } from './restaurant-micheline-star.service';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantMichelineStarController {
  constructor(
    private readonly restaurantMichelineStarService: RestaurantMichelineStarService,
  ) {}

  @Post(':restaurantId/micheline-stars')
  async addMichelineStarToRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Body() michelineStarDto: MichelineStarDto,
  ) {
    const michelineStar = plainToInstance(
      MichelineStarEntity,
      michelineStarDto,
    );
    return await this.restaurantMichelineStarService.addMichelineStarToRestaurant(
      restaurantId,
      michelineStar,
    );
  }

  @Get(':restaurantId/micheline-stars/:michelineStarId')
  async findMichelineStarByRestaurantIdAndMichelineStarId(
    @Param('restaurantId') restaurantId: string,
    @Param('michelineStarId') michelineStarId: string,
  ) {
    return await this.restaurantMichelineStarService.findMichelineStarByRestaurantIdAndMichelineStarId(
      restaurantId,
      michelineStarId,
    );
  }

  @Get(':restaurantId/micheline-stars')
  async findMichelineStarsByRestaurantId(
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.restaurantMichelineStarService.findMichelineStarsByRestaurantId(
      restaurantId,
    );
  }

  @Put(':restaurantId/micheline-stars/:michelineStarId')
  async updateMichelineStar(
    @Param('restaurantId') resturantId: string,
    @Param('michelineStarId') michelineStarId: string,
    @Body() michelineStarDto: MichelineStarDto,
  ) {
    const michelineStar = plainToInstance(
      MichelineStarEntity,
      michelineStarDto,
    );
    return await this.restaurantMichelineStarService.updateMichelineStarOfARestaurant(
      resturantId,
      michelineStarId,
      michelineStar,
    );
  }

  @Delete(':restaurantId/micheline-stars/:michelineStarId')
  @HttpCode(204)
  async deleteMichelineStarOfARestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('michelineStarId') michelineStarId: string,
  ) {
    await this.restaurantMichelineStarService.deleteMichelineStarOfARestaurant(
      restaurantId,
      michelineStarId,
    );
  }
}
