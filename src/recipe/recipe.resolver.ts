import { Args, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { RecipeService } from './recipe.service';
import { RecipeEntity } from './recipe.entity';
import { RecipeDto } from './recipe.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query(() => [RecipeEntity])
  recipes(): Promise<RecipeEntity[]> {
    return this.recipeService.findAll();
  }

  @Query(() => RecipeEntity)
  recipe(@Args('id') id: string): Promise<RecipeEntity> {
    return this.recipeService.findOne(id);
  }

  @Mutation(() => RecipeEntity)
  updateRecipe(
    @Args('id') id: string,
    @Args('recipe') recipeDto: RecipeDto,
  ): Promise<RecipeEntity> {
    const recipe = plainToInstance(RecipeEntity, recipeDto);
    return this.recipeService.updateOne(id, recipe);
  }

  @Mutation(() => String)
  deleteRecipe(@Args('id') id: string) {
    this.recipeService.deleteOne(id);
    return id;
  }
}
