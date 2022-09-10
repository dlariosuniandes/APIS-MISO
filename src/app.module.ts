import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CultureModule } from './culture/culture.module';
import { ProductModule } from './product/product.module';
import { CountryModule } from './country/country.module';
import { RecipeModule } from './recipe/recipe.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureProductModule } from './culture-product/culture-product.module';
import { MichelineStarModule } from './micheline-star/micheline-star.module';
import { RestaurantMichelineStarModule } from './restaurant-micheline-star/restaurant-micheline-star.module';
import { CultureRestaurantModule } from './culture-restaurant/culture-restaurant.module';
import { CultureRecipeModule } from './culture-recipe/culture-recipe.module';
import { databaseConfig } from './shared/db-utils/project-database-config';

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
    TypeOrmModule.forRoot(databaseConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
