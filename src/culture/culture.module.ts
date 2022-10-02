import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureEntity } from './culture.entity';
import { CultureService } from './culture.service';
import { CultureController } from './culture.controller';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { ProductEntity } from 'src/product/product.entity';
import { CountryEntity } from 'src/country/country.entity';
import { CultureResolver } from './culture.resolver';

@Module({
  providers: [CultureService, CultureResolver],
  imports: [
    TypeOrmModule.forFeature([
      CultureEntity,
      RestaurantEntity,
      RecipeEntity,
      ProductEntity,
      CountryEntity,
    ]),
    CacheModule.register(),
  ],
  controllers: [CultureController],
  exports: [CultureService],
})
export class CultureModule {}
