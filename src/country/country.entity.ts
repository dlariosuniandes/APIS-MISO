import { CultureEntity } from 'src/culture/culture.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CountryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CountryEntity, (country) => country.culture)
  culture: CultureEntity;
}
