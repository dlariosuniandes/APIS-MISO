import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { ProductEntity } from './product.entity';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../authorization/role.decorator';
import { Role } from 'src/shared/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Roles(Role.ALLOW_CREATE)
  @Post()
  async create(@Body() productDto: ProductDto) {
    const productInstance: ProductEntity = plainToInstance(
      ProductEntity,
      productDto,
    );
    return await this.productService.create(productInstance);
  }

  @Roles(Role.READ_ONLY)
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'amount', type: Number, required: false })
  @Get()
  async findAll(@Query('skip') skip = 0, @Query('amount') amount = 1000) {
    return await this.productService.findAll(skip, amount);
  }

  @Roles(Role.READ_ONLY)
  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    return await this.productService.findOne(productId);
  }

  @Roles(Role.ALLOW_MODIFY)
  @Put(':productId')
  async updateOne(
    @Param('productId') productId: string,
    @Body() product: ProductDto,
  ) {
    const productInstance: ProductEntity = plainToInstance(
      ProductEntity,
      product,
    );
    return await this.productService.updateOne(productId, productInstance);
  }

  @Roles(Role.ALLOW_DELETE)
  @HttpCode(204)
  @Delete(':productId')
  async deleteOne(@Param('productId') productId: string) {
    await this.productService.deleteOne(productId);
  }
}
