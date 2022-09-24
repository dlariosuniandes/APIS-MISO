import { CacheModule, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductController } from './product.controller';

@Module({
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([ProductEntity]), CacheModule.register()],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
