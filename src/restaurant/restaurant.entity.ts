import { CultureEntity } from 'src/culture/culture.entity';
import { Entity, ManyToMany } from 'typeorm';

@Entity()
export class RestaurantEntity {
  @ManyToMany(() => CultureEntity, (culture) => culture.restaurants)
  cultures: CultureEntity[];
}
