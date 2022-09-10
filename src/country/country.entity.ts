import { CultureEntity } from 'src/culture/culture.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CountryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => CultureEntity, (culture) => culture.countries)
  cultures: CultureEntity[];

  @OneToMany(() => RestaurantEntity, (restuarant) => restuarant.country)
  restaurants: RestaurantEntity[];
}
