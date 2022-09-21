import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { RecipeDto } from './recipe.dto';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async findAll() {
    return await this.recipeService.findAll();
  }

  @Get(':recipeId')
  async findOne(@Param('recipeId') recipeId: string) {
    return await this.recipeService.findOne(recipeId);
  }

  @Put(':recipeId')
  async update(
    @Param('recipeId') recipeId: string,
    @Body() recipeDto: RecipeDto,
  ) {
    const recipe: RecipeEntity = plainToInstance(RecipeEntity, recipeDto);
    return await this.recipeService.updateOne(recipeId, recipe);
  }

  @Delete(':recipeId')
  @HttpCode(204)
  async delete(@Param('recipeId') recipeId: string) {
    return await this.recipeService.deleteOne(recipeId);
  }
}
