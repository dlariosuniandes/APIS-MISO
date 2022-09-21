import { CultureEntity } from 'src/culture/culture.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  story: string;

  @Column()
  category: string;

  @ManyToMany(() => CultureEntity, (culture) => culture.products)
  cultures: CultureEntity[];
}
