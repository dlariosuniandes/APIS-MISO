import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from '../country/country.entity';
import { CountryModule } from '../country/country.module';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { CountryRestaurantController } from './country-restaurant.controller';
import { CountryRestaurantService } from './country-restaurant.service';

@Module({
  providers: [CountryRestaurantService],
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity, CountryEntity]),
    RestaurantModule,
    CountryModule,
  ],
  controllers: [CountryRestaurantController],
})
export class CountryRestaurantModule {}
