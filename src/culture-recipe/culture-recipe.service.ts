import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CultureEntity } from 'src/culture/culture.entity';
import { CultureService } from 'src/culture/culture.service';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { RecipeService } from 'src/recipe/recipe.service';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class CultureRecipeService {
  cacheKey = 'culture-recipes';
  constructor(
    @InjectRepository(CultureEntity)
    private cultureRepository: Repository<CultureEntity>,
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
    private recipeService: RecipeService,
    private cultureService: CultureService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private findRecipeInCulture(
    recipeId: string,
    culture: CultureEntity,
  ): RecipeEntity {
    const interestRecipe: RecipeEntity = culture.recipes.find(
      (rcp) => rcp.id === recipeId,
    );
    if (!interestRecipe) {
      throw new PreconditionFailedException(
        'recipe with the given id is not associated to that culture',
      );
    }
    return interestRecipe;
  }

  async addRecipeToCulture(
    cultureId: string,
    recipe: RecipeEntity,
  ): Promise<CultureEntity> {
    recipe.culture = await this.cultureService.findOne(cultureId);
    await this.recipeRepository.save(recipe);
    return await this.cultureService.findOne(cultureId);
  }

  async updateCultureRecipes(
    cultureId: string,
    recipes: RecipeEntity[],
  ): Promise<CultureEntity> {
    let culture: CultureEntity = await this.cultureService.findOne(cultureId);
    culture.recipes = [];
    culture = await this.cultureRepository.save(culture);
    for (let i = 0; i < recipes.length; i++) {
      recipes[i].culture = culture;
      await this.recipeRepository.save(recipes[i]);
    }

    return await this.cultureService.findOne(cultureId);
  }
  async findRecipeByCultureIdRecipeId(
    recipeId: string,
    cultureId: string,
  ): Promise<RecipeEntity> {
    const interestRecipe: RecipeEntity[] = await this.recipeRepository.findBy({
      id: recipeId,
    });
    if (!interestRecipe[0]) {
      throw new NotFoundException('The recipe with the given id was not found');
    }
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    return this.findRecipeInCulture(recipeId, culture);
  }
  async findRecipesByCultureId(cultureId: string): Promise<RecipeEntity[]> {
    const cached: CultureEntity = await this.cacheManager.get<CultureEntity>(
      this.cacheKey,
    );
    if (!cached) {
      const culture: CultureEntity = await this.cultureService.findOne(
        cultureId,
      );
      await this.cacheManager.set(this.cacheKey, culture);
      return culture.recipes;
    }
    return cached.recipes;
  }

  async deleteRecipeFromCulture(
    recipeId: string,
    cultureId: string,
  ): Promise<CultureEntity> {
    const interestRecipe: RecipeEntity[] = await this.recipeRepository.findBy({
      id: recipeId,
    });
    if (!interestRecipe[0]) {
      throw new NotFoundException('The recipe with the given id was not found');
    }
    const culture = await this.cultureService.findOne(cultureId);
    culture.recipes = culture.recipes.filter((rc) => rc.id !== recipeId);
    await this.cultureRepository.save(culture);
    return await this.cultureService.findOne(cultureId);
  }
}
