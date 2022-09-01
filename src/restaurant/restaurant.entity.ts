import { CultureEntity } from 'src/culture/culture.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RestaurantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.culture)
  culture: CultureEntity;
}
