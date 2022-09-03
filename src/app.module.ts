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

@Module({
  imports: [
    CultureModule,
    ProductModule,
    CountryModule,
    RecipeModule,
    RestaurantModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'culture',
      entities: [
        CultureEntity,
        RestaurantEntity,
        RecipeEntity,
        CountryEntity,
        ProductEntity,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    CultureProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
