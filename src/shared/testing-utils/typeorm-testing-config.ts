import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from '../../country/country.entity';
import { CultureEntity } from '../../culture/culture.entity';
import { ProductEntity } from '../../product/product.entity';
import { RecipeEntity } from '../../recipe/recipe.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      CultureEntity,
      RestaurantEntity,
      ProductEntity,
      RecipeEntity,
      CountryEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CultureEntity,
    RestaurantEntity,
    ProductEntity,
    RecipeEntity,
    CountryEntity,
  ]),
];
