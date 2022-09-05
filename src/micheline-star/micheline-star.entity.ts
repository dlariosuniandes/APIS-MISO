import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum StarRating {
  ONE = 'One Star',
  TWO = 'Two Star',
  THREE = 'Three Stars',
}

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
