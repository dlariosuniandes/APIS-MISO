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
import { MichelineStarDto } from 'src/micheline-star/micheline-star.dto';
import { MichelineStarEntity } from 'src/micheline-star/micheline-star.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { RestaurantMichelineStarService } from './restaurant-micheline-star.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/authorization/role.decorator';
import { Role } from 'src/shared/enums/role.enum';

@ApiTags('Restaurants - Stars')
@ApiBearerAuth()
@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantMichelineStarController {
  constructor(
    private readonly restaurantMichelineStarService: RestaurantMichelineStarService,
  ) {}

  @Roles(Role.ALLOW_CREATE)
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

  @Roles(Role.READ_ONLY)
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

  @Roles(Role.READ_ONLY)
  @Get(':restaurantId/micheline-stars')
  async findMichelineStarsByRestaurantId(
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.restaurantMichelineStarService.findMichelineStarsByRestaurantId(
      restaurantId,
    );
  }

  @Roles(Role.ALLOW_MODIFY)
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

  @Roles(Role.ALLOW_DELETE)
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
