import { CultureEntity } from 'src/culture/culture.entity';
import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => CultureEntity, (culture) => culture.products)
  cultures: CultureEntity[];
}
