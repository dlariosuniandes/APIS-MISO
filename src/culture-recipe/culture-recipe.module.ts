import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureEntity } from 'src/culture/culture.entity';
import { CultureService } from 'src/culture/culture.service';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { RecipeService } from 'src/recipe/recipe.service';
import { CultureRecipeService } from './culture-recipe.service';

@Module({
  imports: [TypeOrmModule.forFeature([CultureEntity, RecipeEntity])],
  providers: [CultureRecipeService, CultureService, RecipeService],
})
export class CultureRecipeModule {}
