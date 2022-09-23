import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { RecipeDto } from './recipe.dto';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Recipes')
@ApiBearerAuth()
@UseInterceptors(BusinessErrorsInterceptor)
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.recipeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':recipeId')
  async findOne(@Param('recipeId') recipeId: string) {
    return await this.recipeService.findOne(recipeId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':recipeId')
  async updateOne(
    @Param('recipeId') recipeId: string,
    @Body() recipeDto: RecipeDto,
  ) {
    const recipe: RecipeEntity = plainToInstance(RecipeEntity, recipeDto);
    return await this.recipeService.updateOne(recipeId, recipe);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':recipeId')
  @HttpCode(204)
  async deleteOne(@Param('recipeId') recipeId: string) {
    return await this.recipeService.deleteOne(recipeId);
  }
}
