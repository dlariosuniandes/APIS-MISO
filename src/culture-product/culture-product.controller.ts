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
import { Roles } from '../authorization/role.decorator';
import { Role } from 'src/shared/enums/role.enum';

@ApiTags('Cultures-Products')
@ApiBearerAuth()
@Controller('cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class CultureProductController {
  constructor(private cultureProductService: CultureProductService) {}

  @Roles(Role.READ_ONLY)
  @Get(':cultureId/products')
  async findAllCultureProducts(@Param('cultureId') cultureId: string) {
    return await this.cultureProductService.findProductsByCultureId(cultureId);
  }

  @Roles(Role.READ_ONLY)
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

  @Roles(Role.ALLOW_CREATE)
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

  @Roles(Role.ALLOW_CREATE)
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

  @Roles(Role.ALLOW_DELETE)
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
