import { CultureEntity } from 'src/culture/culture.entity';
import { MichelineStarEntity } from 'src/micheline-star/micheline-star.entity';
import {
  Column,
  Entity,
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

  @ManyToOne(() => CultureEntity, (culture) => culture.restaurants)
  culture: CultureEntity;

  @OneToMany(
    () => MichelineStarEntity,
    (michelineStar) => michelineStar.restaurant,
  )
  michelineStars: MichelineStarEntity[];
}
