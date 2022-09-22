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
import { MichelineStarDto } from 'src/micheline-star/micheline-star.dto';
import { MichelineStarEntity } from 'src/micheline-star/micheline-star.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { RestaurantMichelineStarService } from './restaurant-micheline-star.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Restaurants - Stars')
@ApiBearerAuth()
@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantMichelineStarController {
  constructor(
    private readonly restaurantMichelineStarService: RestaurantMichelineStarService,
  ) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get(':restaurantId/micheline-stars')
  async findMichelineStarsByRestaurantId(
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.restaurantMichelineStarService.findMichelineStarsByRestaurantId(
      restaurantId,
    );
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
