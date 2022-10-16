import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureEntity } from 'src/culture/culture.entity';
import { CultureModule } from 'src/culture/culture.module';
import { ProductEntity } from 'src/product/product.entity';
import { ProductModule } from 'src/product/product.module';
import { CultureProductService } from './culture-product.service';
import { CultureProductController } from './culture-product.controller';
import { ProductCultureController } from './product-culture.controller';
import { CultureProductResolver } from './culture-product.resolver';
import { ProductCultureResolver } from './product-culture.resolver';

@Module({
  providers: [
    CultureProductService,
    CultureProductResolver,
    ProductCultureResolver,
  ],
  imports: [
    TypeOrmModule.forFeature([CultureEntity, ProductEntity]),
    CultureModule,
    ProductModule,
  ],
  controllers: [CultureProductController, ProductCultureController],
})
export class CultureProductModule {}
