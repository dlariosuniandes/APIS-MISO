import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StarRating {
  ONE = 'One Star',
  TWO = 'Two Star',
  THREE = 'Three Stars',
}

@Entity()
export class MichelineStarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: StarRating,
    default: StarRating.ONE,
  })
  starRating: StarRating;

  @Column({ type: 'date' })
  awardedDate: string;

  @OneToOne(() => RestaurantEntity, (restaurant) => restaurant.michelineStars)
  @JoinColumn()
  restaurant: RestaurantEntity;
}
