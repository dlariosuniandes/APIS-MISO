import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CultureEntity } from 'src/culture/culture.entity';
import { RecipeDto } from 'src/recipe/recipe.dto';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { CultureRecipeService } from './culture-recipe.service';

@Resolver()
export class CultureRecipeResolver {
  constructor(private cultureRecipeService: CultureRecipeService) {}

  @Query(() => [RecipeEntity])
  cultureRecipes(
    @Args('cultureId') cultureId: string,
  ): Promise<RecipeEntity[]> {
    return this.cultureRecipeService.findRecipesByCultureId(cultureId);
  }

  @Query(() => RecipeEntity)
  async cultureRecipe(
    @Args('cultureId') cultureId: string,
    @Args('recipeId') recipeId: string,
  ): Promise<RecipeEntity> {
    return await this.cultureRecipeService.findRecipeByCultureIdRecipeId(
      recipeId,
      cultureId,
    );
  }

  @Mutation(() => CultureEntity)
  createRecipe(
    @Args('cultureId') cultureId: string,
    @Args('recipe') recipeDto: RecipeDto,
  ): Promise<CultureEntity> {
    const recipe = plainToInstance(RecipeEntity, recipeDto);
    return this.cultureRecipeService.addRecipeToCulture(cultureId, recipe);
  }

  @Mutation(() => [CultureEntity])
  updateCultureRecipes(
    @Args('cultureId') cultureId: string,
    @Args('recipes', { type: () => [RecipeDto] }) recipesDto: RecipeDto[],
  ): Promise<CultureEntity> {
    const recipes = plainToInstance(RecipeEntity, recipesDto);
    return this.cultureRecipeService.updateCultureRecipes(cultureId, recipes);
  }

  @Mutation(() => [CultureEntity])
  async deleteCultureRecipe(
    @Args('recipeId') recipeId: string,
    @Args('cultureId') cultureId: string,
  ) {
    this.cultureRecipeService.deleteRecipeFromCulture(recipeId, cultureId);
    return cultureId;
  }
}
