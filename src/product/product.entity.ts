import { CultureEntity } from 'src/culture/culture.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEnum } from '../enums/category.enum';
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

  @Column('int')
  category: CategoryEnum;

  @ManyToMany(() => CultureEntity, (culture) => culture.products)
  cultures: CultureEntity[];
}
