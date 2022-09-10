import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CultureProductService } from './culture-product.service';

@Controller('cultures')
export class CultureProductsController {
  constructor(private cultureProductService: CultureProductService) {}

  @Get(':cultureId/products')
  async findAllCultureProducts(@Param('cultureId') cultureId: string) {
    return await this.cultureProductService.findProductsByCultureId(cultureId);
  }

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
