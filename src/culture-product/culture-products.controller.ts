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
@Controller('cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class CultureProductsController {
  constructor(private cultureProductService: CultureProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':cultureId/products')
  async findAllCultureProducts(@Param('cultureId') cultureId: string) {
    return await this.cultureProductService.findProductsByCultureId(cultureId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':cultureId/products/:productId')
  async findProductByCultureIdProductId(
    @Param('cultureId') cultureId: string,
    @Param('productId') productId: string,
  ) {
    return await this.cultureProductService.findProductByCultureIdProductId(
      productId,
      cultureId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':cultureId/products/:productId')
  async addProductToCulture(
    @Param('cultureId') cultureId: string,
    @Param('productId') productId: string,
  ) {
    return await this.cultureProductService.addProductToCulture(
      productId,
      cultureId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':cultureId/products')
  async associateProductsToCulture(
    @Param('cultureId') cultureId: string,
    @Body() productsIds: string[],
  ) {
    return await this.cultureProductService.associateProductsToCulture(
      cultureId,
      productsIds,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':cultureId/products/:productId')
  async removeProductFromCulture(
    @Param('cultureId') cultureId: string,
    @Param('productId') productId: string,
  ) {
    return await this.cultureProductService.deleteProductFromCulture(
      productId,
      cultureId,
    );
  }
}
