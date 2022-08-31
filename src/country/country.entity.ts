import { CultureEntity } from 'src/culture/culture.entity';
import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CountryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => CultureEntity, (culture) => culture.countries)
  cultures: CultureEntity[];
}
