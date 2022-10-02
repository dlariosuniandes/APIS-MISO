import { CultureEntity } from 'src/culture/culture.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CountryEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => [CultureEntity], { nullable: true })
  @ManyToMany(() => CultureEntity, (culture) => culture.countries)
  cultures: CultureEntity[];

  @Field(() => [RestaurantEntity])
  @OneToMany(() => RestaurantEntity, (restaurant) => restaurant.country)
  restaurants: RestaurantEntity[];
}
