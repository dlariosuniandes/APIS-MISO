import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CultureProductService } from './culture-product.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-strategy/jwt-auth.guard';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductCulturesController {
  constructor(private cultureProductService: CultureProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':productId/cultures')
  async findAllProductCultures(@Param('productId') productId: string) {
    return await this.cultureProductService.findCulturesByProductId(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':productId/cultures/:cultureId')
  async findCultureByProductIdCultureId(
    @Param('cultureId') cultureId: string,
    @Param('productId') productId: string,
  ) {
    return await this.cultureProductService.findCultureByProductIdCultureId(
      productId,
      cultureId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':productId/cultures/:cultureId')
  async addCultureToProduct(
    @Param('cultureId') cultureId: string,
    @Param('productId') productId: string,
  ) {
    return await this.cultureProductService.addCultureToProduct(
      productId,
      cultureId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':productId/cultures')
  async associateCulturesToProduct(
    @Param('productId') productId: string,
    @Body() culturesIds: string[],
  ) {
    return await this.cultureProductService.associateCulturesToProduct(
      productId,
      culturesIds,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId/cultures/:cultureId')
  async removeCultureFromProduct(
    @Param('cultureId') cultureId: string,
    @Param('productId') productId: string,
  ) {
    return await this.cultureProductService.deleteCultureFromProduct(
      productId,
      cultureId,
    );
  }
}
