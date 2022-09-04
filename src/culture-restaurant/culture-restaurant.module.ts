import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureEntity } from 'src/culture/culture.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { CultureRestaurantService } from './culture-restaurant.service';

@Module({
  imports: [TypeOrmModule.forFeature([CultureEntity, RestaurantEntity])],
  providers: [CultureRestaurantService],
})
export class CultureRestaurantModule {}
