import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureEntity } from 'src/culture/culture.entity';
import { CultureModule } from 'src/culture/culture.module';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { RecipeModule } from 'src/recipe/recipe.module';
import { CultureRecipeService } from './culture-recipe.service';
import { CultureRecipeController } from './culture-recipe.controller';

@Module({
  providers: [CultureRecipeService],
  imports: [
    TypeOrmModule.forFeature([RecipeEntity, CultureEntity]),
    RecipeModule,
    CultureModule,
  ],
  controllers: [CultureRecipeController],
})
export class CultureRecipeModule {}
