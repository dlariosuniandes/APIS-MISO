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
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { ProductEntity } from './product.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../authorization/role.decorator';
import { Role } from '../authorization/role.enum';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Roles(Role.Creator)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() productDto: ProductDto) {
    const productInstance: ProductEntity = plainToInstance(
      ProductEntity,
      productDto,
    );
    return await this.productService.create(productInstance);
  }

  @Roles(Role.Reader)
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'amount', type: Number, required: false })
  @Get()
  async findAll(@Query('skip') skip = 0, @Query('amount') amount = 50000) {
    return await this.productService.findAll(skip, amount);
  }

  @Roles(Role.Reader)
  @UseGuards(JwtAuthGuard)
  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    return await this.productService.findOne(productId);
  }

  @Roles(Role.Editor)
  @UseGuards(JwtAuthGuard)
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

  @Roles(Role.Remover)
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':productId')
  async deleteOne(@Param('productId') productId: string) {
    await this.productService.deleteOne(productId);
  }
}
