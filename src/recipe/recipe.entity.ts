import { CultureEntity } from 'src/culture/culture.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.culture)
  culture: CultureEntity;
}
