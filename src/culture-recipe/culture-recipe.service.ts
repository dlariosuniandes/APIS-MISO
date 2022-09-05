import {
  Injectable,
  PreconditionFailedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CultureEntity } from 'src/culture/culture.entity';
import { CultureService } from 'src/culture/culture.service';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { RecipeService } from 'src/recipe/recipe.service';
import { Repository } from 'typeorm';

@Injectable()
export class CultureRecipeService {
  constructor(
    @InjectRepository(CultureEntity)
    private cultureRepository: Repository<CultureEntity>,
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
    private recipeService: RecipeService,
    private cultureService: CultureService,
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
    recipeEntity: RecipeEntity,
  ): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    recipeEntity.culture = culture;
    await this.recipeRepository.save(recipeEntity);
    return await this.cultureService.findOne(cultureId);
  }
  async findRecipeByCultureIdRecipeId(
    recipeId: string,
    cultureId: string,
  ): Promise<RecipeEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    return this.findRecipeInCulture(recipeId, culture);
  }
  async findRecipesByCultureId(cultureId: string): Promise<RecipeEntity[]> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    if (!culture.recipes) {
      throw new NotFoundException(
        'The culture with the given id was not found',
      );
    }
    return culture.recipes;
  }
  async deleteRecetaFromCulture(recipeId, cultureId): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    const undesiredProduct: RecipeEntity = this.findRecipeInCulture(
      recipeId,
      culture,
    );
    culture.recipes = culture.recipes.filter((rcp) => rcp !== undesiredProduct);
    return await this.cultureRepository.save(culture);
  }
}
