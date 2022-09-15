import { CultureEntity } from '../../culture/culture.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';
import { RecipeEntity } from '../../recipe/recipe.entity';
import { CountryEntity } from '../../country/country.entity';
import { ProductEntity } from '../../product/product.entity';
import { MichelineStarEntity } from '../../micheline-star/micheline-star.entity';
import { UserEntity } from '../../users/user.entity';

export const databaseConfig: object = {
  type: process.env.DBTYPE || 'postgres',
  host: process.env.DBHOST || 'localhost',
  port: process.env.DBPORT || 5432,
  username: process.env.DBUSERNAME || 'postgres',
  password: process.env.DBPASSWORD || 'postgres',
  database: process.env.DBNAME || 'postgres',
  entities: [
    CultureEntity,
    RestaurantEntity,
    RecipeEntity,
    CountryEntity,
    ProductEntity,
    MichelineStarEntity,
    UserEntity,
  ],
  dropSchema: false,
  synchronize: true,
  keepConnectionAlive: true,
};
