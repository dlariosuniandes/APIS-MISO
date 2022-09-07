import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureEntity } from 'src/culture/culture.entity';
import { CultureModule } from 'src/culture/culture.module';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { CultureRestaurantService } from './culture-restaurant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CultureEntity, RestaurantEntity]),
    RestaurantModule,
    CultureModule,
  ],
  providers: [CultureRestaurantService],
})
export class CultureRestaurantModule {}
