import { CacheModule, Module } from '@nestjs/common';
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
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { CultureCountryModule } from './culture-country/culture-country.module';
import { CountryRestaurantModule } from './restaurant-country/country-restaurant.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

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
    CultureCountryModule,
    CountryRestaurantModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(databaseConfig),
    CacheModule.register({ ttl: 60, isGlobal: true }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
