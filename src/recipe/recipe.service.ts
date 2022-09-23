import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
  ) {}

  // async create(recipe: RecipeEntity): Promise<RecipeEntity> {
  //   return await this.recipeRepository.save(recipe);
  // }

  async findAll(): Promise<RecipeEntity[]> {
    return await this.recipeRepository.find();
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
