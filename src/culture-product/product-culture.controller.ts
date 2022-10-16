import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CultureProductService } from './culture-product.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Products - Cultures')
@ApiBearerAuth()
@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductCultureController {
  constructor(private cultureProductService: CultureProductService) {}

  @Get(':productId/cultures')
  async findAllProductCultures(@Param('productId') productId: string) {
    return await this.cultureProductService.findCulturesByProductId(productId);
  }

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
