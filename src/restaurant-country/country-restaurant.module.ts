import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from 'src/country/country.entity';
import { CountryModule } from 'src/country/country.module';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
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
