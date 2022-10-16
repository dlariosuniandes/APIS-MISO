import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class RecipeService {
  cacheKey = 'recipes';
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<RecipeEntity[]> {
    const cached: RecipeEntity[] = await this.cacheManager.get<RecipeEntity[]>(
      this.cacheKey,
    );
    if (!cached) {
      const recipes: RecipeEntity[] = await this.recipeRepository.find();
      await this.cacheManager.set(this.cacheKey, recipes);
      return recipes;
    }
    return cached;
  }

  async findOne(id: string): Promise<RecipeEntity> {
    const recipe: RecipeEntity = await this.recipeRepository.findOne({
      where: { id: id },
      relations: ['culture'],
    });
    if (!recipe) {
      throw new NotFoundException('The recipe with the given id was not found');
    }
    return recipe;
  }

  async updateOne(id: string, recipe: RecipeEntity): Promise<RecipeEntity> {
    const recipeDB: RecipeEntity = await this.recipeRepository.findOne({
      where: { id },
      relations: ['culture'],
    });
    if (!recipeDB) {
      throw new NotFoundException('The recipe with the given id was not found');
    }
    return await this.recipeRepository.save({ ...recipeDB, ...recipe });
  }

  async deleteOne(id: string): Promise<string> {
    const recipeDB: RecipeEntity = await this.recipeRepository.findOne({
      where: { id },
      relations: ['culture'],
    });
    if (!recipeDB) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.recipeRepository.remove(recipeDB);
    return `recipe ${id} was successfully removed`;
  }
}
