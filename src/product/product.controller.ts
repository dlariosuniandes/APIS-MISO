import {
  Body,
  Controller,
  Delete,
  Get, HttpCode, HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { ProductEntity } from './product.entity';
import { plainToInstance } from 'class-transformer';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  async create(@Body() productDto: ProductDto) {
    const productInstance: ProductEntity = plainToInstance(
      ProductEntity,
      productDto,
    );
    return await this.productService.create(productInstance);
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    return await this.productService.findOne(productId);
  }

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

  @HttpCode(204)
  @Delete(':productId')
  async deleteOne(@Param('productId') productId: string) {
    await this.productService.deleteOne(productId);
  }
}
