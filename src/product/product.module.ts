import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductController } from './product.controller';
import { ProductResolver } from './product.resolver';

@Module({
  providers: [ProductService, ProductResolver],
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
