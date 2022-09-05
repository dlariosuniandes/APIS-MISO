import { CultureEntity } from 'src/culture/culture.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  preparation: string;

  @Column()
  url_photo: string;

  @Column()
  url_video: string;

  @ManyToOne(() => CultureEntity, (culture) => culture.recipes, {
    onDelete: 'CASCADE',
  })
  culture: CultureEntity;
}
