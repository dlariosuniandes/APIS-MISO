import { CultureEntity } from 'src/culture/culture.entity';
import { Entity, ManyToMany } from 'typeorm';

@Entity()
export class CountryEntity {
  @ManyToMany(() => CultureEntity, (culture) => culture.countries)
  cultures: CultureEntity[];
}
