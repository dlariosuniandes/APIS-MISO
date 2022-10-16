import { CountryEntity } from '../country/country.entity';
import { CultureEntity } from '../culture/culture.entity';
import { MichelineStarEntity } from '../micheline-star/micheline-star.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RestaurantEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  city: string;

  @Field(() => CountryEntity, { nullable: true })
  @ManyToOne(() => CountryEntity, (country) => country.restaurants)
  country: CountryEntity;

  @ManyToMany(() => CultureEntity, (culture) => culture.restaurants)
  cultures: CultureEntity[];

  @Field(() => [MichelineStarEntity], { nullable: true })
  @OneToMany(
    () => MichelineStarEntity,
    (michelineStar) => michelineStar.restaurant,
  )
  michelineStars: MichelineStarEntity[];
}
