import { CultureEntity } from 'src/culture/culture.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class RecipeEntity {
  @ManyToOne(() => RecipeEntity, (recipe) => recipe.culture)
  culture: CultureEntity;
}
