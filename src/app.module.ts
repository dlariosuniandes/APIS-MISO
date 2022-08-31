import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CultureModule } from './culture/culture.module';
import { ProductModule } from './product/product.module';
import { CountryModule } from './country/country.module';
import { RecipeModule } from './recipe/recipe.module';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [CultureModule, ProductModule, CountryModule, RecipeModule, RestaurantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
