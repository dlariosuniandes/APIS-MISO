import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { ProductEntity } from './product.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-strategy/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() productDto: ProductDto) {
    const productInstance: ProductEntity = plainToInstance(
      ProductEntity,
      productDto,
    );
    return await this.productService.create(productInstance);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    return await this.productService.findOne(productId);
  }

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

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':productId')
  async deleteOne(@Param('productId') productId: string) {
    await this.productService.deleteOne(productId);
  }
}
