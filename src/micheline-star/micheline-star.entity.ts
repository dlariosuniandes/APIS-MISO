import { StarRating } from '../shared/enums/star-rating.enum';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class MichelineStarEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  starRating: StarRating;

  @Field()
  @Column()
  awardedDate: string;

  @Field(() => RestaurantEntity)
  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.michelineStars)
  restaurant: RestaurantEntity;
}
