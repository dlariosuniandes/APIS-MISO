import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureEntity } from '../culture/culture.entity';
import { CultureModule } from '../culture/culture.module';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { CultureRestaurantService } from './culture-restaurant.service';
import { CultureRestaurantController } from './culture-restaurant.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CultureEntity, RestaurantEntity]),
    RestaurantModule,
    CultureModule,
  ],
  providers: [CultureRestaurantService],
  controllers: [CultureRestaurantController],
})
export class CultureRestaurantModule {}
