import { TypeOrmModule } from '@nestjs/typeorm';
import { MichelineStarEntity } from '../../micheline-star/micheline-star.entity';
import { CountryEntity } from '../../country/country.entity';
import { CultureEntity } from '../../culture/culture.entity';
import { ProductEntity } from '../../product/product.entity';
import { RecipeEntity } from '../../recipe/recipe.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';
import { UserEntity } from '../../user/user.entity';
import { CacheModule } from '@nestjs/common';
import { RoleEntity } from 'src/role/role.entity';

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
      MichelineStarEntity,
      UserEntity,
      RoleEntity,
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
    MichelineStarEntity,
    UserEntity,
    RoleEntity,
  ]),
  CacheModule.register(),
];
