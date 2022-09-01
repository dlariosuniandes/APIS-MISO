import { CultureEntity } from 'src/culture/culture.entity';
import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RestaurantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => CultureEntity, (culture) => culture.restaurants)
  cultures: CultureEntity[];
}
