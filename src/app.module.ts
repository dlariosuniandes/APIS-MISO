import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CultureModule } from './culture/culture.module';
import { ProductModule } from './product/product.module';
import { CountryModule } from './country/country.module';
import { RecipeModule } from './recipe/recipe.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureEntity } from './culture/culture.entity';
import { RestaurantEntity } from './restaurant/restaurant.entity';
import { RecipeEntity } from './recipe/recipe.entity';
import { CountryEntity } from './country/country.entity';
import { ProductEntity } from './product/product.entity';
import { CultureProductModule } from './culture-product/culture-product.module';
import { MichelineStarModule } from './micheline-star/micheline-star.module';
import { MichelineStarEntity } from './micheline-star/micheline-star.entity';
import { RestaurantMichelineStarModule } from './restaurant-micheline-star/restaurant-micheline-star.module';
import { CultureRestaurantModule } from './culture-restaurant/culture-restaurant.module';
import { CultureRecipeModule } from './culture-recipe/culture-recipe.module';
import { CultureCountryModule } from './culture-country/culture-country.module';
import { CountryRestaurantModule } from './restaurant-country/country-restaurant.module';
import { databaseConfig } from './shared/db-utils/project-database-config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CultureModule,
    ProductModule,
    CountryModule,
    RecipeModule,
    RestaurantModule,
    MichelineStarModule,
    RestaurantMichelineStarModule,
    CultureRestaurantModule,
    CultureProductModule,
    CultureRecipeModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(databaseConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
