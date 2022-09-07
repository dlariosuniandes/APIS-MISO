import { CultureEntity } from 'src/culture/culture.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CountryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => CountryEntity, (country) => country.culture)
  culture: CultureEntity;
}
