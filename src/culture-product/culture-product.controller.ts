import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CultureProductService } from './culture-product.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../authorization/role.decorator';
import { Role } from '../authorization/role.enum';
import { Cache } from 'cache-manager';

@ApiTags('Cultures-Products')
@ApiBearerAuth()
@Controller('cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class CultureProductController {
  constructor(private cultureProductService: CultureProductService) {}

  @Roles(Role.Reader)
  @UseGuards(JwtAuthGuard)
  @Get(':cultureId/products')
  async findAllCultureProducts(@Param('cultureId') cultureId: string) {
    return await this.cultureProductService.findProductsByCultureId(cultureId);
  }

  @Roles(Role.Reader)
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

  @Roles(Role.Creator, Role.Editor)
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

  @Roles(Role.Creator, Role.Editor)
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

  @Roles(Role.Editor, Role.Remover)
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
