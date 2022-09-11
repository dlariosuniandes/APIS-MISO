import { CountryEntity } from 'src/country/country.entity';
import { CultureEntity } from 'src/culture/culture.entity';
import { MichelineStarEntity } from 'src/micheline-star/micheline-star.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RestaurantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @ManyToOne(() => CountryEntity, (country) => country.restaurants)
  country: CountryEntity;

  @ManyToMany(() => CultureEntity, (culture) => culture.restaurants)
  cultures: CultureEntity[];

  @OneToMany(
    () => MichelineStarEntity,
    (michelineStar) => michelineStar.restaurant,
  )
  michelineStars: MichelineStarEntity[];

  @ManyToOne(() => CountryEntity, (country) => country.restaurants)
  country: CountryEntity;
}
