import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MichelineStarEntity } from 'src/micheline-star/micheline-star.entity';
import { MichelineStarModule } from 'src/micheline-star/micheline-star.module';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { RestaurantMichelineStarService } from './restaurant-micheline-star.service';
import { RestaurantMichelineStarController } from './restaurant-micheline-star.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity, MichelineStarEntity]),
    RestaurantModule,
    MichelineStarModule,
  ],
  providers: [RestaurantMichelineStarService],
  controllers: [RestaurantMichelineStarController],
})
export class RestaurantMichelineStarModule {}
