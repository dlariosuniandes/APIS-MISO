import { StarRating } from '../shared/enums/star-rating.enum';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MichelineStarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  starRating: StarRating;

  @Column()
  awardedDate: string;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.michelineStars)
  restaurant: RestaurantEntity;
}
