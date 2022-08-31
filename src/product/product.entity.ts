import { CultureEntity } from 'src/culture/culture.entity';
import { Entity, ManyToMany } from 'typeorm';

@Entity()
export class ProductEntity {
  @ManyToMany(() => CultureEntity, (culture) => culture.products)
  cultures: CultureEntity[];
}
